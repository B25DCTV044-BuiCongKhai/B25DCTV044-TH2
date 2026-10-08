import type { Book, BookSearchResult, NewBook } from "./types";

const BOOKS_KEY = "trang-sach.books.v1";
const FAVORITES_KEY = "trang-sach.favorites.v1";
const OPEN_LIBRARY_URL = "https://openlibrary.org/search.json";

function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;

  const book = value as Record<string, unknown>;
  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.category === "string" &&
    (typeof book.publishedYear === "number" || book.publishedYear === null) &&
    typeof book.isbn === "string" &&
    typeof book.description === "string" &&
    typeof book.coverUrl === "string" &&
    typeof book.addedAt === "string"
  );
}

function readStoredBooks(): Book[] {
  const raw = localStorage.getItem(BOOKS_KEY);
  if (raw === null) return [];

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isBook)) {
    throw new Error("Dữ liệu sách đã lưu không đúng định dạng. Hãy kiểm tra hoặc xóa dữ liệu thư viện trong trình duyệt.");
  }
  return parsed;
}

function readStoredFavorites(): string[] {
  const raw = localStorage.getItem(FAVORITES_KEY);
  if (raw === null) return [];

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every((item): item is string => typeof item === "string")) {
    throw new Error("Dữ liệu sách yêu thích đã lưu không đúng định dạng.");
  }
  return parsed;
}

export function getBooks(): Book[] {
  return readStoredBooks();
}

export function getFavorites(): Set<string> {
  return new Set(readStoredFavorites());
}

export function createBook(input: NewBook): Book {
  const books = readStoredBooks();
  const book: Book = {
    ...input,
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  };
  localStorage.setItem(BOOKS_KEY, JSON.stringify([book, ...books]));
  return book;
}

export function deleteBook(id: string): void {
  const books = readStoredBooks();
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books.filter((book) => book.id !== id)));

  const favorites = readStoredFavorites().filter((favoriteId) => favoriteId !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function toggleFavorite(id: string): boolean {
  const favorites = readStoredFavorites();
  const isFavorite = favorites.includes(id);
  const updated = isFavorite ? favorites.filter((favoriteId) => favoriteId !== id) : [...favorites, id];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return !isFavorite;
}

interface OpenLibraryDocument {
  title?: unknown;
  author_name?: unknown;
  first_publish_year?: unknown;
  isbn?: unknown;
  cover_i?: unknown;
  subject?: unknown;
}

interface OpenLibraryResponse {
  docs?: unknown;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item): item is string => typeof item === "string");
}

function toSearchResult(doc: OpenLibraryDocument): BookSearchResult | null {
  if (typeof doc.title !== "string" || doc.title.length === 0) return null;

  const authors = isStringArray(doc.author_name) ? doc.author_name : [];
  const isbns = isStringArray(doc.isbn) ? doc.isbn : [];
  const subjects = isStringArray(doc.subject) ? doc.subject : [];
  const year = typeof doc.first_publish_year === "number" ? doc.first_publish_year : null;
  const coverId = typeof doc.cover_i === "number" ? doc.cover_i : null;

  return {
    title: doc.title,
    author: authors[0] ?? "",
    category: subjects[0] ?? "",
    publishedYear: year,
    isbn: isbns[0] ?? "",
    coverUrl: coverId === null ? "" : `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`,
  };
}

export async function searchOpenLibrary(query: string): Promise<BookSearchResult[]> {
  const url = new URL(OPEN_LIBRARY_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("fields", "title,author_name,first_publish_year,isbn,cover_i,subject");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Không thể tra cứu sách (HTTP ${response.status}). Vui lòng thử lại.`);
  }

  const payload: unknown = await response.json();
  if (typeof payload !== "object" || payload === null || !("docs" in payload)) {
    throw new Error("Dữ liệu trả về từ Open Library không hợp lệ.");
  }

  const docs = (payload as OpenLibraryResponse).docs;
  if (!Array.isArray(docs)) {
    throw new Error("Dữ liệu trả về từ Open Library không có danh sách sách.");
  }

  return docs
    .filter((doc): doc is OpenLibraryDocument => typeof doc === "object" && doc !== null)
    .map(toSearchResult)
    .filter((book): book is BookSearchResult => book !== null);
}
