export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  publishedYear: number | null;
  isbn: string;
  description: string;
  coverUrl: string;
  addedAt: string;
}

export interface NewBook {
  title: string;
  author: string;
  category: string;
  publishedYear: number | null;
  isbn: string;
  description: string;
  coverUrl: string;
}

export interface BookSearchResult {
  title: string;
  author: string;
  category: string;
  publishedYear: number | null;
  isbn: string;
  coverUrl: string;
}

export type LibraryView = "all" | "favorites";
