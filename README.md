# 🛒 Node.js E-commerce API

Một RESTful API hoàn chỉnh cho hệ thống thương mại điện tử được xây dựng bằng Node.js, Express và MongoDB.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [API Endpoints](#-api-endpoints)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Tính Năng Bảo Mật](#-tính-năng-bảo-mật)
- [Performance & Optimization](#-performance--optimization)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Tính Năng

### 🔐 Authentication & Authorization
- JWT-based authentication
- User registration và login
- Password hashing với bcryptjs
- Role-based access control (Admin/User)

### 📦 Product Management
- CRUD operations cho sản phẩm
- Category management
- Product search và filtering
- Image upload support
- Stock management

### 🛍️ Order Management
- Create và manage orders
- Order status tracking
- Payment integration
- Shipping address management

### 🔒 Security Features
- Input validation với Joi
- Rate limiting
- XSS protection
- MongoDB injection prevention
- Security headers với Helmet

### ⚡ Performance Features
- Caching với NodeCache
- Database connection pooling
- Pagination support
- Query optimization

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Document Mapper)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Security & Performance
- **Joi** - Input validation
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - MongoDB injection prevention
- **xss-clean** - XSS protection
- **node-cache** - Caching

### Development Tools
- **nodemon** - Auto restart development server
- **Winston** - Logging
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Cài Đặt

### Prerequisites
- Node.js (v14 hoặc cao hơn)
- MongoDB (local hoặc cloud)
- npm hoặc yarn

### Bước 1: Clone Repository
```bash
git clone https://github.com/TrapedBoiz/node_hn86.git
cd node_hn86
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Cấu Hình Environment Variables
Tạo file `.env` trong thư mục root:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_super_secret_jwt_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
LOG_LEVEL=info
```

### Bước 4: Chạy Ứng Dụng
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## ⚙️ Cấu Hình

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |

### Database Setup
```bash
# Kết nối MongoDB
mongodb://localhost:27017/ecommerce_db

# Hoặc MongoDB Atlas
mongodb+srv://username:password@cluster.mongodb.net/ecommerce_db
```

## 📡 API Endpoints

### Authentication
```
POST /user/register     - Đăng ký user mới
POST /user/login        - Đăng nhập
GET  /user/profile      - Lấy thông tin profile (protected)
PUT  /user              - Cập nhật profile (protected)
POST /user/delete       - Xóa user (protected)
POST /user/update_password - Đổi mật khẩu (protected)
```

### Products
```
GET    /product         - Lấy danh sách sản phẩm (protected)
POST   /product/insert  - Thêm sản phẩm mới (protected)
PATCH  /product         - Cập nhật sản phẩm (protected)
DELETE /product         - Xóa sản phẩm (protected)
POST   /product/import/all - Import sản phẩm từ data
```

### Categories
```
GET    /category        - Lấy danh sách categories
POST   /category/insert - Thêm category mới
PATCH  /category        - Cập nhật category
DELETE /category        - Xóa category
POST   /category/import/all - Import categories từ data
```

### Orders
```
GET    /order           - Lấy danh sách orders (protected)
POST   /order           - Tạo order mới (protected)
PATCH  /order           - Cập nhật order (protected)
DELETE /order           - Xóa order (protected)
POST   /order/import/all - Import orders từ data
```

### File Upload
```
POST   /upload          - Upload file
```

## 📁 Cấu Trúc Dự Án

```
node_hn86/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── const/
│   │   ├── res_code.js        # Response codes
│   │   ├── res_enum.js        # Response enums
│   │   ├── res_mess.js        # Response messages
│   │   ├── response.enum.js   # Response enums
│   │   ├── tolist_if_only.js  # Utility functions
│   │   ├── wrap_response.js    # Response wrapper
│   │   └── ResStatus.js       # Status constants
│   ├── controllers/
│   │   ├── user_controller.js     # User business logic
│   │   ├── product_controller.js  # Product business logic
│   │   ├── category_controller.js # Category business logic
│   │   ├── order_controller.js    # Order business logic
│   │   └── upload_controller.js   # Upload business logic
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── error.js           # Error handling
│   │   ├── upload.js          # File upload
│   │   ├── validation.js      # Input validation
│   │   ├── cache.js           # Caching middleware
│   │   └── security.js        # Security middleware
│   ├── models/
│   │   ├── enum_model/
│   │   │   ├── delivery_enum.js   # Delivery status enums
│   │   │   └── pament_enum.js     # Payment status enums
│   │   └── schema/
│   │       ├── user_model.js      # User schema
│   │       ├── product_model.js   # Product schema
│   │       ├── category_model.js  # Category schema
│   │       └── order_model.js     # Order schema
│   ├── routers/
│   │   ├── users.route.js     # User routes
│   │   ├── product.route.js   # Product routes
│   │   ├── category.route.js  # Category routes
│   │   ├── order.route.js     # Order routes
│   │   └── upload.route.js    # Upload routes
│   ├── services/
│   │   └── userService.js     # User service layer
│   ├── utils/
│   │   ├── logger.js          # Logging utility
│   │   ├── errorHandler.js    # Error handling utility
│   │   └── pagination.js      # Pagination utility
│   ├── data.js               # Sample data
│   └── index.js              # Application entry point
├── uploads/                  # Uploaded files
├── logs/                     # Log files
├── package.json
├── package-lock.json
└── README.md
```

## 🔒 Tính Năng Bảo Mật

### Authentication & Authorization
- JWT token-based authentication
- Password hashing với bcryptjs (salt rounds: 12)
- Protected routes với middleware
- Role-based access control

### Input Validation
- Joi schema validation
- MongoDB injection prevention
- XSS protection
- Input sanitization

### Rate Limiting
- General API rate limiting (100 requests/15min)
- Auth routes rate limiting (5 requests/15min)
- IP-based limiting

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Content Security Policy
- X-Frame-Options

## ⚡ Performance & Optimization

### Caching
- NodeCache implementation
- Configurable TTL
- Cache invalidation
- Memory-efficient caching

### Database Optimization
- Connection pooling
- Query optimization
- Indexing strategies
- Efficient data retrieval

### Pagination
- Configurable page size
- Efficient database queries
- Metadata for pagination
- Consistent response format

## 🛠️ Development

### Scripts
```bash
npm run dev          # Development mode với nodemon
npm start            # Production mode
npm test             # Run tests
npm run lint         # ESLint
npm run format       # Prettier formatting
```

### Logging
- Winston logger implementation
- Structured logging
- Log levels: error, warn, info, debug
- Log files: `logs/error.log`, `logs/combined.log`

### Error Handling
- Centralized error handling
- Custom error classes
- Development vs production error responses
- Detailed error logging

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure MongoDB connection
3. Set secure JWT secret
4. Configure CORS origins
5. Set up logging

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/prod_db
JWT_SECRET=very_secure_jwt_secret_key
ALLOWED_ORIGINS=https://yourdomain.com
LOG_LEVEL=error
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 API Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### API Testing
Sử dụng Postman hoặc curl để test API endpoints:

```bash
# Test health check
curl http://localhost:3000/

# Test user registration
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"123456","phone":"1234567890","gender":"male"}'
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ESLint for code linting
- Follow Prettier formatting
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **hainguyen8086** - *Initial work* - [GitHub](https://github.com/TrapedBoiz)

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the database
- All contributors and maintainers

## 📞 Support

Nếu bạn gặp vấn đề:

1. Kiểm tra [Issues](https://github.com/TrapedBoiz/node_hn86/issues)
2. Tạo issue mới nếu vấn đề chưa được báo cáo
3. Kiểm tra log files trong thư mục `logs/`
4. Verify environment variables
5. Check database connection

---

**Happy Coding! 🚀** 