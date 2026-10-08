import BookCard from "./BookCard.jsx";

function BookList({ books, favorites, onToggleFavorite }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">♡</span>
        <h3>Chưa có cuốn sách nào ở đây</h3>
        <p>Hãy lưu lại những cuốn sách khiến bạn rung động nhé.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book, index) => (
        <BookCard
          book={book}
          key={book.id}
          isFavorite={favorites.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
          index={index}
        />
      ))}
    </div>
  );
}

export default BookList;
