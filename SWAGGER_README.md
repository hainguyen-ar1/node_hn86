# Swagger API Documentation

## Tổng quan

Dự án này đã được tích hợp Swagger để tạo API documentation tự động. Swagger giúp developers và testers dễ dàng hiểu và test các API endpoints.

## Cách truy cập

1. Khởi động server:
```bash
npm run dev
```

2. Truy cập Swagger UI tại: `http://localhost:3000/api-docs`

## Các API Endpoints được document

### 1. Users API
- **POST** `/user/import/all` - Import users từ data mẫu
- **POST** `/user/login` - Đăng nhập user
- **POST** `/user/register` - Đăng ký user mới
- **PUT** `/user` - Cập nhật profile user
- **POST** `/user/delete` - Xóa user
- **POST** `/user/update_password` - Thay đổi password
- **GET** `/user/profile` - Lấy thông tin profile user

### 2. Messages API
- **POST** `/messages/send` - Gửi tin nhắn
- **GET** `/messages/room/{roomId}` - Lấy tin nhắn theo phòng (với cursor-based pagination)
- **PUT** `/messages/read` - Đánh dấu tin nhắn đã đọc
- **DELETE** `/messages/{messageId}` - Xóa tin nhắn

### 3. Rooms API
- **POST** `/room/leave` - Rời khỏi phòng chat
- **GET** `/room/{roomId}` - Lấy thông tin phòng chat

### 4. Queue API
- **POST** `/queue/join` - Tham gia hàng đợi matching
- **POST** `/queue/leave` - Rời khỏi hàng đợi matching
- **GET** `/queue/status` - Lấy trạng thái hàng đợi

### 5. Categories API
- **POST** `/category/import/all` - Import categories từ data mẫu
- **POST** `/category/insert` - Thêm category mới
- **GET** `/category` - Lấy danh sách categories
- **POST** `/category/update` - Cập nhật category

### 6. Products API
- **POST** `/product/import/all` - Import products từ data mẫu
- **POST** `/product/insert` - Thêm product mới
- **GET** `/product` - Lấy danh sách products
- **PATCH** `/product` - Cập nhật product
- **DELETE** `/product` - Xóa product

### 7. Orders API
- **POST** `/order/import/all` - Import orders từ data mẫu
- **POST** `/order/insert` - Tạo order mới
- **GET** `/order` - Lấy danh sách orders của user

### 8. Upload API
- **POST** `/upload/image` - Upload hình ảnh

## Tính năng Swagger

### 1. Authentication
- Sử dụng Bearer Token (JWT)
- Các API protected sẽ yêu cầu token trong header `Authorization: Bearer <token>`

### 2. Request/Response Schemas
- Định nghĩa rõ ràng cấu trúc request và response
- Validation tự động cho các trường bắt buộc
- Examples cho mỗi API endpoint

### 3. Testing
- Test trực tiếp các API từ Swagger UI
- Hỗ trợ upload file cho API upload
- Hiển thị response status và data

### 4. Documentation
- Mô tả chi tiết từng API endpoint
- Phân loại theo tags (Users, Messages, Rooms, etc.)
- Thông tin về parameters, request body, và responses

## Cách sử dụng

### 1. Xem API Documentation
- Truy cập `/api-docs`
- Browse các API endpoints theo categories
- Đọc mô tả và schema của từng API

### 2. Test API
- Click vào API endpoint muốn test
- Click "Try it out"
- Điền parameters và request body (nếu cần)
- Click "Execute" để test API

### 3. Authentication
- Để test các protected API, cần:
  1. Đăng nhập để lấy token
  2. Click vào biểu tượng khóa ở API endpoint
  3. Nhập token vào field "bearerAuth"
  4. Click "Authorize"

## Cấu trúc file

```
src/
├── swagger.js              # Cấu hình Swagger chính
├── routers/                # Route files với Swagger comments
│   ├── users.route.js
│   ├── message.route.js
│   ├── room.route.js
│   ├── queue.route.js
│   ├── category.route.js
│   ├── product.route.js
│   ├── order.route.js
│   └── upload.route.js
└── index.js                # Tích hợp Swagger UI
```

## Cập nhật Documentation

Để thêm hoặc cập nhật API documentation:

1. **Thêm API mới**: Thêm Swagger comments vào route file tương ứng
2. **Cập nhật Schema**: Chỉnh sửa schemas trong `src/swagger.js`
3. **Thêm Tags**: Tạo tags mới cho nhóm API mới

### Ví dụ thêm API mới:

```javascript
/**
 * @swagger
 * /api/new-endpoint:
 *   get:
 *     summary: Mô tả ngắn gọn
 *     description: Mô tả chi tiết
 *     tags: [TagName]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/new-endpoint', controllerFunction);
```

## Lưu ý

- Server phải được khởi động để truy cập Swagger UI
- Các API protected cần token hợp lệ để test
- File upload chỉ hỗ trợ trong Swagger UI, không thể test từ code
- Swagger comments phải tuân theo format chuẩn để generate documentation chính xác
