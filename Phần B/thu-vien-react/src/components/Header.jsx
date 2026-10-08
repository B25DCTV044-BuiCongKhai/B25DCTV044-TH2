function Header({
  favoriteCount,
  isDark,
  onToggleTheme,
  onShowFavorites,
  showFavorites,
}) {
  return (
    <header className="site-header">
      <a className="brand" href="#" aria-label="Mực và Mơ - trang chủ">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <path d="M16 8.5c-3.3-2.1-7.1-2.2-11-1v15c4.1-1.2 7.8-1 11 1.2 3.2-2.2 6.9-2.4 11-1.2v-15c-3.9-1.2-7.7-1.1-11 1Z" />
            <path d="M16 9v14.7M8.5 11.1c1.8-.3 3.4-.1 4.8.6m-4.8 3c1.8-.3 3.4-.1 4.8.6m10.2-4.2c-1.8-.3-3.4-.1-4.8.6m4.8 3c-1.8-.3-3.4-.1-4.8.6" />
          </svg>
        </span>
        <span className="brand-name">mực <i>&amp;</i> mơ<span>ĐỌC MỘT CHÚT, MƠ MỘT ĐỜI</span></span>
      </a>
      <nav className="header-actions" aria-label="Điều hướng chính">
        <button
          className={`favorites-button${showFavorites ? " is-active" : ""}`}
          type="button"
          onClick={onShowFavorites}
          aria-pressed={showFavorites}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
          <span>Yêu thích</span>
          <span className="favorite-count">{favoriteCount}</span>
        </button>
        <span className="header-divider" aria-hidden="true" />
        <button
          className="theme-button"
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "Bật chế độ sáng" : "Bật chế độ tối"}
          title={isDark ? "Chế độ sáng" : "Chế độ tối"}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
}

export default Header;
