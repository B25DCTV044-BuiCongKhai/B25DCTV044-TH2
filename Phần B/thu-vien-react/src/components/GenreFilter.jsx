function GenreFilter({ genres, activeGenre, onSelect }) {
  return (
    <div className="genre-filter" role="group" aria-label="Lọc sách theo thể loại">
      {genres.map((genre) => (
        <button
          className={`genre-chip${genre === activeGenre ? " is-active" : ""}`}
          key={genre}
          type="button"
          onClick={() => onSelect(genre)}
          aria-pressed={genre === activeGenre}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;
