# Mực & Mơ — Thư viện React

## Chạy dự án

```bash
npm install
npm run dev
```

Ứng dụng sử dụng dữ liệu sách tĩnh trong `src/data.js`, không cần API hay
cơ sở dữ liệu. Mở địa chỉ Local mà Vite hiển thị trong terminal (thường là
`http://localhost:5173`); không mở `dist/index.html` trực tiếp bằng `file://`.

Để xem bản production sau khi build:

```bash
npm run build
npm run preview
```

Sau đó mở địa chỉ preview mà Vite hiển thị trong terminal.

## So sánh Phần A và Phần B

Phần A thường xây dựng giao diện trực tiếp trong một tệp HTML/JavaScript, phù
hợp với ví dụ nhỏ nhưng khó tái sử dụng khi ứng dụng lớn dần. Phần B dùng
React để chia giao diện thành các component như `Header`, `BookList` và
`BookCard`; dữ liệu và trạng thái được truyền qua props, giúp mã nguồn dễ đọc,
dễ bảo trì và cập nhật giao diện theo trạng thái.
