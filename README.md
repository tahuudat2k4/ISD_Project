# Hệ thống Quản lý Trường Mầm Non Hiền Giang

Hệ thống quản lý giáo viên và học sinh cho Trường Mầm Non Hiền Giang với giao diện hiện đại, thân thiện.

## Công nghệ sử dụng

### Frontend
- React 19
- Vite
- React Router 7
- Tailwind CSS 4
- Axios
- Lucide React (Icons)
- Sonner (Toast notifications)

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcrypt
- CORS

## Tính năng

- ✅ Quản lý giáo viên (Thêm, Sửa, Xóa, Tìm kiếm)
- ✅ Quản lý học sinh (Thêm, Sửa, Xóa, Tìm kiếm)
- ✅ Giao diện hiện đại, thân thiện
- ✅ Không sử dụng gradient
- ✅ Responsive design
- ✅ Toast notifications

## Cài đặt

### Yêu cầu
- Node.js (v18 hoặc cao hơn)
- MongoDB

### Backend

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

4. Cập nhật các biến môi trường trong file `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hien_giang_preschool
JWT_SECRET=your_jwt_secret_key_here
```

5. Khởi động server:
```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5000`

### Frontend

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` (tùy chọn):
```
VITE_API_URL=http://localhost:5000/api
```

4. Khởi động development server:
```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

## Cấu trúc thư mục

```
ATI_Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # Cấu hình MongoDB
│   │   ├── models/
│   │   │   ├── Teacher.js     # Model giáo viên
│   │   │   └── Student.js     # Model học sinh
│   │   ├── routes/
│   │   │   ├── teachers.js    # Routes API giáo viên
│   │   │   └── students.js    # Routes API học sinh
│   │   └── server.js          # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx     # Layout chính
    │   ├── pages/
    │   │   ├── Home.jsx       # Trang chủ
    │   │   ├── Teachers.jsx   # Trang quản lý giáo viên
    │   │   └── Students.jsx   # Trang quản lý học sinh
    │   ├── services/
    │   │   └── api.js         # API service
    │   ├── App.jsx            # App component
    │   ├── main.jsx           # Entry point
    │   └── index.css          # Global styles
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## API Endpoints

### Giáo viên
- `GET /api/teachers` - Lấy danh sách giáo viên
- `GET /api/teachers/:id` - Lấy thông tin một giáo viên
- `POST /api/teachers` - Tạo giáo viên mới
- `PUT /api/teachers/:id` - Cập nhật giáo viên
- `DELETE /api/teachers/:id` - Xóa giáo viên

### Học sinh
- `GET /api/students` - Lấy danh sách học sinh
- `GET /api/students/:id` - Lấy thông tin một học sinh
- `POST /api/students` - Tạo học sinh mới
- `PUT /api/students/:id` - Cập nhật học sinh
- `DELETE /api/students/:id` - Xóa học sinh

## Build cho production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## License

MIT

## Tác giả

Trường Mầm Non Hiền Giang
