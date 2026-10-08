import { createBook, deleteBook, getBooks, getFavorites, searchOpenLibrary, toggleFavorite } from "./api";
import type { Book, BookSearchResult, LibraryView, NewBook } from "./types";
import "./../style.css";

function requireElement<T extends HTMLElement>(element: T | null, selector: string): T {
  if (!element) throw new Error(`Không tìm thấy thành phần giao diện: ${selector}`);
  return element;
}

const bookForm = requireElement(document.querySelector<HTMLFormElement>("#book-form"), "#book-form");
const titleInput = requireElement(document.querySelector<HTMLInputElement>("#title-input"), "#title-input");
const authorInput = requireElement(document.querySelector<HTMLInputElement>("#author-input"), "#author-input");
const categoryInput = requireElement(document.querySelector<HTMLInputElement>("#category-input"), "#category-input");
const yearInput = requireElement(document.querySelector<HTMLInputElement>("#year-input"), "#year-input");
const isbnInput = requireElement(document.querySelector<HTMLInputElement>("#isbn-input"), "#isbn-input");
const coverInput = requireElement(document.querySelector<HTMLInputElement>("#cover-input"), "#cover-input");
const descriptionInput = requireElement(document.querySelector<HTMLTextAreaElement>("#description-input"), "#description-input");
const lookupButton = requireElement(document.querySelector<HTMLButtonElement>("#lookup-button"), "#lookup-button");
const lookupResults = requireElement(document.querySelector<HTMLDivElement>("#lookup-results"), "#lookup-results");
const bookGrid = requireElement(document.querySelector<HTMLDivElement>("#book-grid"), "#book-grid");
const emptyState = requireElement(document.querySelector<HTMLDivElement>("#empty-state"), "#empty-state");
const emptyTitle = requireElement(document.querySelector<HTMLHeadingElement>("#empty-title"), "#empty-title");
const emptyDescription = requireElement(document.querySelector<HTMLParagraphElement>("#empty-description"), "#empty-description");
const searchInput = requireElement(document.querySelector<HTMLInputElement>("#search-input"), "#search-input");
const categoryFilter = requireElement(document.querySelector<HTMLSelectElement>("#category-filter"), "#category-filter");
const libraryTitle = requireElement(document.querySelector<HTMLHeadingElement>("#library-title"), "#library-title");
const currentViewLabel = requireElement(document.querySelector<HTMLElement>("#current-view-label"), "#current-view-label");
const allCount = requireElement(document.querySelector<HTMLElement>("#all-count"), "#all-count");
const favoriteCount = requireElement(document.querySelector<HTMLElement>("#favorite-count"), "#favorite-count");
const statNumber = requireElement(document.querySelector<HTMLElement>("#stat-number"), "#stat-number");
const libraryStatus = requireElement(document.querySelector<HTMLParagraphElement>("#library-status"), "#library-status");

let books: Book[] = [];
let favorites = new Set<string>();
let currentView: LibraryView = "all";
let searchResults: BookSearchResult[] = [];

function setStatus(message: string): void {
  libraryStatus.textContent = message;
}

function makeElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function updateCategoryOptions(): void {
  const selectedCategory = categoryFilter.value;
  const categories = [...new Set(books.map((book) => book.category.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "vi"));
  categoryFilter.replaceChildren(new Option("Tất cả thể loại", ""));
  for (const category of categories) {
    categoryFilter.add(new Option(category, category));
  }
  categoryFilter.value = categories.includes(selectedCategory) ? selectedCategory : "";
}

function createBookCard(book: Book): HTMLElement {
  const card = makeElement("article", "book-card");
  const cover = makeElement("div", "book-cover");
  cover.setAttribute("aria-label", `Bìa sách ${book.title}`);
  if (book.coverUrl) {
    const image = makeElement("img");
    image.src = book.coverUrl;
    image.alt = `Bìa sách ${book.title}`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      cover.replaceChildren(makeElement("span", "cover-fallback", "trang sách"));
    }, { once: true });
    cover.append(image);
  } else {
    cover.append(makeElement("span", "cover-fallback", "trang sách"));
  }

  const actions = makeElement("div", "card-actions");
  const favoriteButton = makeElement("button", `icon-button favorite-button${favorites.has(book.id) ? " is-favorite" : ""}`);
  favoriteButton.type = "button";
  favoriteButton.dataset.action = "favorite";
  favoriteButton.dataset.id = book.id;
  favoriteButton.setAttribute("aria-label", favorites.has(book.id) ? "Bỏ yêu thích" : "Thêm vào yêu thích");
  favoriteButton.setAttribute("aria-pressed", String(favorites.has(book.id)));
  favoriteButton.append(makeElement("span", undefined, favorites.has(book.id) ? "♥" : "♡"));

  const deleteButton = makeElement("button", "icon-button delete-button");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = book.id;
  deleteButton.setAttribute("aria-label", `Xóa sách ${book.title}`);
  deleteButton.append(makeElement("span", undefined, "×"));
  actions.append(favoriteButton, deleteButton);

  const info = makeElement("div", "book-info");
  if (book.category) info.append(makeElement("span", "book-category", book.category));
  info.append(makeElement("h3", "book-title", book.title));
  info.append(makeElement("p", "book-author", book.author));
  if (book.description) info.append(makeElement("p", "book-description", book.description));

  const metadata = makeElement("div", "book-meta");
  metadata.append(makeElement("span", undefined, book.publishedYear ? String(book.publishedYear) : "Chưa rõ năm"));
  if (book.isbn) metadata.append(makeElement("span", undefined, `ISBN ${book.isbn}`));
  info.append(metadata);
  card.append(cover, actions, info);
  return card;
}

function render(): void {
  const query = searchInput.value.trim().toLocaleLowerCase("vi");
  const category = categoryFilter.value;
  const visibleBooks = books.filter((book) => {
    const matchesView = currentView === "all" || favorites.has(book.id);
    const searchableText = `${book.title} ${book.author} ${book.isbn}`.toLocaleLowerCase("vi");
    return matchesView && (!query || searchableText.includes(query)) && (!category || book.category === category);
  });

  bookGrid.replaceChildren(...visibleBooks.map(createBookCard));
  emptyState.hidden = visibleBooks.length > 0;
  if (visibleBooks.length === 0) {
    const hasBooks = books.length > 0;
    const hasFavorites = currentView === "favorites";
    emptyTitle.textContent = hasBooks
      ? hasFavorites ? "Chưa có sách yêu thích" : "Không tìm thấy cuốn sách phù hợp"
      : "Kệ sách của bạn còn trống";
    emptyDescription.textContent = hasBooks
      ? hasFavorites ? "Nhấn biểu tượng trái tim trên một cuốn sách để lưu vào đây." : "Thử thay đổi từ khóa hoặc bộ lọc thể loại."
      : "Thêm cuốn sách đầu tiên để bắt đầu xây dựng thư viện riêng.";
  }

  allCount.textContent = String(books.length);
  favoriteCount.textContent = String(favorites.size);
  statNumber.textContent = String(books.length).padStart(2, "0");
  updateCategoryOptions();
  setStatus(`${visibleBooks.length} cuốn sách`);
}

function refreshLibrary(): void {
  books = getBooks();
  favorites = getFavorites();
  updateCategoryOptions();
  render();
}

function applySearchResult(book: BookSearchResult): void {
  titleInput.value = book.title;
  authorInput.value = book.author;
  categoryInput.value = book.category;
  yearInput.value = book.publishedYear === null ? "" : String(book.publishedYear);
  isbnInput.value = book.isbn;
  coverInput.value = book.coverUrl;
  searchResults = [];
  lookupResults.replaceChildren();
  titleInput.focus();
  setStatus(`Đã điền thông tin “${book.title}”.`);
}

function renderSearchResults(results: BookSearchResult[]): void {
  searchResults = results;
  lookupResults.replaceChildren();
  if (results.length === 0) {
    lookupResults.append(makeElement("p", "lookup-message", "Không tìm thấy sách. Bạn có thể nhập thông tin thủ công."));
    return;
  }

  lookupResults.append(makeElement("p", "lookup-message", "Chọn kết quả để điền nhanh thông tin:"));
  const list = makeElement("div", "lookup-list");
  results.forEach((result, index) => {
    const button = makeElement("button", "lookup-result");
    button.type = "button";
    button.dataset.resultIndex = String(index);
    button.append(
      makeElement("span", "lookup-result-title", result.title),
      makeElement("span", "lookup-result-author", result.author || "Chưa rõ tác giả"),
      makeElement("span", "lookup-result-year", result.publishedYear ? String(result.publishedYear) : ""),
    );
    list.append(button);
  });
  lookupResults.append(list);
}

bookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  if (!title || !author) {
    setStatus("Vui lòng nhập tên sách và tác giả.");
    (title ? authorInput : titleInput).focus();
    return;
  }

  if (!bookForm.checkValidity()) {
    bookForm.reportValidity();
    setStatus("Vui lòng kiểm tra năm xuất bản và đường dẫn ảnh bìa.");
    return;
  }

  const year = yearInput.value.trim();
  const newBook: NewBook = {
    title,
    author,
    category: categoryInput.value.trim(),
    publishedYear: year ? Number(year) : null,
    isbn: isbnInput.value.trim(),
    description: descriptionInput.value.trim(),
    coverUrl: coverInput.value.trim(),
  };

  try {
    createBook(newBook);
    bookForm.reset();
    lookupResults.replaceChildren();
    refreshLibrary();
    setStatus(`Đã thêm “${title}” vào thư viện.`);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Không thể lưu sách vào thư viện.");
  }
});

lookupButton.addEventListener("click", async () => {
  const query = titleInput.value.trim() || isbnInput.value.trim();
  if (!query) {
    setStatus("Nhập tên sách hoặc ISBN trước khi tra cứu.");
    titleInput.focus();
    return;
  }

  lookupButton.disabled = true;
  lookupResults.replaceChildren(makeElement("p", "lookup-message", "Đang tìm trên Open Library..."));
  try {
    const results = await searchOpenLibrary(query);
    renderSearchResults(results);
    setStatus(results.length ? `Tìm thấy ${results.length} kết quả.` : "Không tìm thấy kết quả phù hợp.");
  } catch (error) {
    lookupResults.replaceChildren();
    setStatus(error instanceof Error ? error.message : "Không thể kết nối Open Library.");
  } finally {
    lookupButton.disabled = false;
  }
});

lookupResults.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const resultButton = target.closest<HTMLButtonElement>("[data-result-index]");
  if (!resultButton) return;
  const index = Number(resultButton.dataset.resultIndex);
  const result = searchResults[index];
  if (Number.isInteger(index) && result) applySearchResult(result);
});

bookGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>("[data-action][data-id]");
  if (!button) return;

  const { action, id } = button.dataset;
  if (!id) return;
  try {
    if (action === "favorite") {
      toggleFavorite(id);
      refreshLibrary();
      return;
    }
    if (action === "delete") {
      const book = books.find((item) => item.id === id);
      deleteBook(id);
      refreshLibrary();
      setStatus(book ? `Đã xóa “${book.title}” khỏi thư viện.` : "Đã xóa sách khỏi thư viện.");
    }
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Không thể cập nhật thư viện.");
  }
});

document.querySelectorAll<HTMLButtonElement>("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view === "favorites" ? "favorites" : "all";
    document.querySelectorAll("[data-view]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    const label = currentView === "all" ? "Tất cả sách" : "Yêu thích";
    currentViewLabel.textContent = label;
    libraryTitle.textContent = currentView === "all" ? "Kệ sách của bạn" : "Sách yêu thích";
    render();
  });
});

searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", render);

const date = new Intl.DateTimeFormat("vi-VN", { day: "numeric", month: "long", year: "numeric" });
const todayLabel = document.querySelector<HTMLElement>("#today-label");
if (todayLabel) todayLabel.textContent = date.format(new Date());

try {
  refreshLibrary();
} catch (error) {
  setStatus(error instanceof Error ? error.message : "Không thể tải thư viện đã lưu.");
}
