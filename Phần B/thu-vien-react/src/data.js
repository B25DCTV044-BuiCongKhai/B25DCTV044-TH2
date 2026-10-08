export const books = [
  {
    id: 1,
    title: "Nhà giả kim",
    author: "Paulo Coelho",
    genre: "Tiểu thuyết",
    year: 1988,
    rating: 4.8,
    description:
      "Hành trình theo đuổi vận mệnh và lắng nghe tiếng gọi từ trái tim mình.",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=700&h=980&fit=crop",
    coverColor: "#c88a59",
    label: "Được yêu thích",
  },
  {
    id: 2,
    title: "Đi tìm lẽ sống",
    author: "Viktor E. Frankl",
    genre: "Tâm lý",
    year: 1946,
    rating: 4.9,
    description:
      "Một góc nhìn sâu sắc về ý nghĩa cuộc sống ngay cả trong nghịch cảnh.",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=700&h=980&fit=crop",
    coverColor: "#6d8290",
  },
  {
    id: 3,
    title: "Tuổi trẻ đáng giá bao nhiêu",
    author: "Rosie Nguyễn",
    genre: "Phát triển bản thân",
    year: 2016,
    rating: 4.6,
    description:
      "Những gợi ý giản dị để sống hết mình, học hỏi và khám phá bản thân.",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=700&h=980&fit=crop",
    coverColor: "#bf8d5b",
    label: "Sách Việt",
  },
  {
    id: 4,
    title: "Rừng Na Uy",
    author: "Haruki Murakami",
    genre: "Tiểu thuyết",
    year: 1987,
    rating: 4.5,
    description:
      "Câu chuyện dịu buồn về ký ức, tuổi trẻ và những điều ta không thể níu giữ.",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=700&h=980&fit=crop",
    coverColor: "#557568",
  },
  {
    id: 5,
    title: "Sapiens: Lược sử loài người",
    author: "Yuval Noah Harari",
    genre: "Lịch sử",
    year: 2011,
    rating: 4.7,
    description:
      "Nhìn lại hành trình của nhân loại qua những cuộc cách mạng lớn.",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=700&h=980&fit=crop",
    coverColor: "#8d6958",
    label: "Bán chạy",
  },
  {
    id: 6,
    title: "Đắc nhân tâm",
    author: "Dale Carnegie",
    genre: "Phát triển bản thân",
    year: 1936,
    rating: 4.7,
    description:
      "Những nguyên tắc thiết thực để thấu hiểu và kết nối với mọi người.",
    cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=700&h=980&fit=crop",
    coverColor: "#c38b56",
  },
  {
    id: 7,
    title: "Hoàng tử bé",
    author: "Antoine de Saint-Exupéry",
    genre: "Thiếu nhi",
    year: 1943,
    rating: 4.9,
    description:
      "Một chuyến du hành nhỏ bé nhắc ta nhìn thế giới bằng trái tim.",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=700&h=980&fit=crop",
    coverColor: "#7a98ac",
    label: "Kinh điển",
  },
  {
    id: 8,
    title: "Bước chậm lại giữa thế gian vội vã",
    author: "Hae Min",
    genre: "Tâm lý",
    year: 2012,
    rating: 4.6,
    description:
      "Những khoảng lặng ấm áp để chăm sóc tâm hồn giữa cuộc sống bận rộn.",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&h=980&fit=crop",
    coverColor: "#927b72",
  },
];

export const genres = ["Tất cả", ...new Set(books.map((book) => book.genre))];
