# Hệ Thống Quản Lý Trường Mầm Non

## Giới thiệu
Website quản lý giáo viên và học sinh của trường mầm non với giao diện hiện đại, thân thiện và dễ sử dụng.

## Tính năng

### 🔐 Đăng nhập
- Trang đăng nhập an toàn
- Thông tin đăng nhập mặc định:
  - Tên đăng nhập: `admin`
  - Mật khẩu: `admin123`

### 📊 Dashboard
- Hiển thị tổng quan hệ thống
- Thống kê số lượng giáo viên, học sinh, lớp học
- Tính toán trung bình học sinh/lớp

### 👨‍🏫 Quản lý Giáo viên
- Xem danh sách giáo viên
- Thêm giáo viên mới
- Sửa thông tin giáo viên
- Xóa giáo viên
- Thông tin: Họ tên, Email, Số điện thoại, Môn dạy, Lớp phụ trách

### 👶 Quản lý Học sinh
- Xem danh sách học sinh
- Thêm học sinh mới
- Sửa thông tin học sinh
- Xóa học sinh
- Thông tin: Họ tên, Ngày sinh, Giới tính, Lớp, Phụ huynh, Số điện thoại liên hệ

## Thiết kế

### 🎨 Giao diện
- Thiết kế hiện đại, thân thiện
- **Không sử dụng gradient** cho background (theo yêu cầu)
- Sử dụng màu sắc solid, tươi sáng
- Responsive design - tương thích với mọi thiết bị
- Card-based layout cho dễ đọc

### 🎯 Màu sắc chủ đạo
- Xanh dương (#3498db) - màu chính
- Xanh lá (#27ae60) - màu thành công
- Đỏ (#e74c3c) - màu nguy hiểm
- Xám (#95a5a6) - màu phụ
- Nền sáng (#f5f7fa)

## Công nghệ sử dụng

### Frontend
- HTML5
- CSS3 (Không có gradient)
- JavaScript (Vanilla JS)

### Lưu trữ dữ liệu
- LocalStorage - lưu trữ dữ liệu trên trình duyệt
- SessionStorage - quản lý phiên đăng nhập

## Cấu trúc thư mục
```
ATI_Project/
├── index.html          # Trang đăng nhập
├── dashboard.html      # Trang dashboard
├── teachers.html       # Quản lý giáo viên
├── students.html       # Quản lý học sinh
├── css/
│   └── style.css      # File CSS chính
└── js/
    ├── login.js       # Xử lý đăng nhập
    ├── auth.js        # Xác thực người dùng
    ├── dashboard.js   # Logic dashboard
    ├── teachers.js    # Logic quản lý giáo viên
    └── students.js    # Logic quản lý học sinh
```

## Hướng dẫn sử dụng

### 1. Mở website
- Mở file `index.html` trong trình duyệt web

### 2. Đăng nhập
- Nhập tên đăng nhập: `admin`
- Nhập mật khẩu: `admin123`
- Nhấn "Đăng nhập"

### 3. Sử dụng các chức năng
- **Dashboard**: Xem tổng quan hệ thống
- **Giáo viên**: Quản lý danh sách giáo viên
- **Học sinh**: Quản lý danh sách học sinh
- **Đăng xuất**: Thoát khỏi hệ thống

## Tính năng nổi bật

✅ Giao diện hiện đại, thân thiện  
✅ Không sử dụng gradient colors (theo yêu cầu)  
✅ Responsive design  
✅ CRUD đầy đủ cho giáo viên và học sinh  
✅ Validation form  
✅ Lưu trữ dữ liệu local  
✅ Modal popup cho thêm/sửa  
✅ Xác nhận khi xóa  
✅ Thống kê tự động  

## Trình duyệt hỗ trợ
- Chrome (khuyên dùng)
- Firefox
- Edge
- Safari

## Phát triển tương lai
- Kết nối với backend API
- Hệ thống phân quyền
- Quản lý điểm danh
- Quản lý học phí
- Báo cáo và xuất file
- Thông báo cho phụ huynh

## Tác giả
Hệ thống Quản lý Trường Mầm Non - 2026
