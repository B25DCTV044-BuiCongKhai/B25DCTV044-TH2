import { useEffect, useState } from "react";
import { books, genres } from "./data.js";
import BookList from "./components/BookList.jsx";
import Footer from "./components/Footer.jsx";
import GenreFilter from "./components/GenreFilter.jsx";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";

function getSavedValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.error(`Không thể đọc cài đặt "${key}" từ bộ nhớ trình duyệt.`, error);
    return fallback;
  }
}

function App() {
  const [favorites, setFavorites] = useState(() =>
    getSavedValue("hien-sach-favorites", []),
  );
  const [theme, setTheme] = useState(() =>
    getSavedValue("hien-sach-theme", "light"),
  );
  const [activeGenre, setActiveGenre] = useState("Tất cả");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("hien-sach-theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("hien-sach-favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(bookId) {
    setFavorites((current) =>
      current.includes(bookId)
        ? current.filter((id) => id !== bookId)
        : [...current, bookId],
    );
  }

  const visibleBooks = books.filter((book) => {
    const matchesGenre = activeGenre === "Tất cả" || book.genre === activeGenre;
    const matchesFavorites = !showFavorites || favorites.includes(book.id);
    return matchesGenre && matchesFavorites;
  });

  function handleShowFavorites() {
    setShowFavorites((current) => !current);
    setActiveGenre("Tất cả");
  }

  return (
    <div className="app-shell">
      <Header
        favoriteCount={favorites.length}
        isDark={theme === "dark"}
        onToggleTheme={() =>
          setTheme((current) => (current === "light" ? "dark" : "light"))
        }
        onShowFavorites={handleShowFavorites}
        showFavorites={showFavorites}
      />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span /> GÓC NHỎ DÀNH CHO NGƯỜI YÊU SÁCH</span>
            <h1>
              Mỗi ngày,
              <br />
              <span>một trang hay.</span>
            </h1>
            <p>
              Tìm một cuốn sách khiến bạn muốn ngồi lại lâu hơn.
              <br className="desktop-break" /> Chọn điều mình thích, phần còn lại
              để những trang sách kể.
            </p>
            <a className="hero-link" href="#book-shelf">
              Khám phá thư viện <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun-disc" />
            <div className="book-stack book-stack-back" />
            <div className="book-stack book-stack-mid" />
            <div className="book-stack book-stack-front">
              <span>một chút<br />bình yên</span>
              <i>MỰC &amp; MƠ</i>
            </div>
            <span className="hero-sparkle sparkle-one">✳</span>
            <span className="hero-sparkle sparkle-two">✳</span>
            <span className="hero-note">the quiet<br />between pages</span>
          </div>
          <div className="hero-caption"><span>01</span> · TUYỂN CHỌN CHO BẠN</div>
        </section>

        <Section
          id="book-shelf"
          title={showFavorites ? "Sách bạn yêu thích" : "Một cuốn sách, một thế giới"}
          subtitle={
            showFavorites
              ? "Những cuốn sách bạn đã lưu lại."
              : "Chọn một thể loại và tìm câu chuyện dành cho mình."
          }
          action={
            <span className="book-count">
              <strong>{visibleBooks.length.toString().padStart(2, "0")}</strong>
              <span>CUỐN SÁCH</span>
            </span>
          }
        >
          {!showFavorites && (
            <GenreFilter
              genres={genres}
              activeGenre={activeGenre}
              onSelect={setActiveGenre}
            />
          )}
          <BookList
            books={visibleBooks}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </Section>

        <section className="quote-banner">
          <span className="quote-mark">“</span>
          <p>Một căn phòng không có sách giống như một cơ thể không có linh hồn.</p>
          <span className="quote-author">— CICERO</span>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
