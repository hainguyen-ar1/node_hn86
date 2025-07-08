# 🚫 Rate Limiting Implementation

## 📋 Tổng Quan

Dự án đã được implement rate limiting để bảo vệ API khỏi abuse và brute force attacks.

## 🔧 Cấu Hình Rate Limiting

### 1. **General Rate Limiting**
```javascript
// Áp dụng cho tất cả API routes
app.use('/api', limiter)
```

**Cấu hình:**
- **Window**: 15 phút
- **Max requests**: 100 requests per IP
- **Message**: "Too many requests from this IP, please try again later."

### 2. **Auth Rate Limiting**
```javascript
// Áp dụng cho auth routes
app.use('/user/login', authLimiter)
app.use('/user/register', authLimiter)
```

**Cấu hình:**
- **Window**: 15 phút
- **Max requests**: 5 requests per IP
- **Message**: "Too many login attempts, please try again later."

## 📊 Test Results

### ✅ Rate Limiting Test
```
Request 1-5: 401 (Invalid credentials - allowed)
Request 6-7: 429 (Rate Limited - blocked)
```

### ✅ Security Headers Test
```
X-Frame-Options: SAMEORIGIN ✅
X-Content-Type-Options: nosniff ✅
X-XSS-Protection: 0 ✅
Content-Security-Policy: Set ✅
```

## 🛡️ Bảo Mật

### **Brute Force Protection**
- Login attempts bị giới hạn 5 lần/15 phút
- Register attempts bị giới hạn 5 lần/15 phút
- Prevents automated attacks

### **API Abuse Protection**
- General API routes: 100 requests/15 phút
- Prevents DDoS attacks
- Protects server resources

## 📍 Implementation Details

### **File: `src/middleware/security.js`**
```javascript
// General rate limiting
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Auth rate limiting
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later.'
  }
});
```

### **File: `src/index.js`**
```javascript
// Rate limiting
app.use('/api', limiter) // General rate limiting for all API routes

// Auth routes with strict rate limiting
app.use('/user/login', authLimiter)
app.use('/user/register', authLimiter)
```

## 🔍 Monitoring

### **Rate Limit Headers**
Response headers include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

### **Error Response**
```json
{
  "status": "error",
  "message": "Too many login attempts, please try again later."
}
```

## 🧪 Testing

### **Manual Testing**
```bash
# Test rate limiting
for i in {1..7}; do
  curl -X POST http://localhost:3000/user/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"123456"}'
  echo "Request $i completed"
done
```

### **Automated Testing**
```bash
# Run test script
node test_rate_limit.js
```

## ⚙️ Customization

### **Adjust Rate Limits**
```javascript
// More strict rate limiting
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 requests per 5 minutes
  message: {
    status: 'error',
    message: 'Rate limit exceeded'
  }
});

// More lenient rate limiting
const lenientLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // 1000 requests per hour
  message: {
    status: 'error',
    message: 'Too many requests'
  }
});
```

### **Per-Route Rate Limiting**
```javascript
// Different limits for different routes
app.use('/api/products', productLimiter);
app.use('/api/orders', orderLimiter);
app.use('/api/users', userLimiter);
```

## 📈 Best Practices

### **1. Monitor Rate Limiting**
- Log rate limit violations
- Alert on unusual patterns
- Track IP addresses

### **2. User-Friendly Messages**
- Clear error messages
- Include retry information
- Suggest alternatives

### **3. Progressive Rate Limiting**
- Start with lenient limits
- Increase restrictions based on abuse
- Implement whitelist for trusted IPs

### **4. Rate Limit Headers**
- Always include rate limit headers
- Help clients understand limits
- Enable client-side rate limiting

## 🔧 Troubleshooting

### **Common Issues**

1. **Rate limiting not working**
   - Check middleware order
   - Verify route paths
   - Check environment variables

2. **Too strict rate limiting**
   - Adjust max requests
   - Increase window time
   - Add IP whitelist

3. **Rate limiting bypassed**
   - Check proxy configuration
   - Verify IP detection
   - Review security headers

### **Debug Commands**
```bash
# Check rate limit headers
curl -I http://localhost:3000/user/login

# Test with different IPs
curl -H "X-Forwarded-For: 192.168.1.1" http://localhost:3000/user/login
```

## 📚 References

- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
- [Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

---

**Rate limiting đã được implement thành công và đang hoạt động! 🎉** 