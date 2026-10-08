function BookCard({ book, isFavorite, onToggleFavorite, index }) {
  return (
    <article className="book-card" style={{ "--card-index": index }}>
      <div className="book-cover-wrap">
        <img
          className="book-cover"
          src={book.cover}
          alt={`Bìa sách ${book.title}`}
          loading="lazy"
          style={{ backgroundColor: book.coverColor }}
        />
        {book.label && <span className="book-label">{book.label}</span>}
        <button
          className={`heart-button${isFavorite ? " is-favorite" : ""}`}
          type="button"
          onClick={() => onToggleFavorite(book.id)}
          aria-label={
            isFavorite
              ? `Bỏ ${book.title} khỏi yêu thích`
              : `Thêm ${book.title} vào yêu thích`
          }
          aria-pressed={isFavorite}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
      </div>
      <div className="book-details">
        <span className="book-genre">{book.genre} <span>·</span> {book.year}</span>
        <h3>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <p className="book-description">{book.description}</p>
        <div className="book-rating" aria-label={`Đánh giá ${book.rating} trên 5`}>
          <span aria-hidden="true">★</span>
          {book.rating.toFixed(1)}
          <span className="rating-note"> / 5.0</span>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
