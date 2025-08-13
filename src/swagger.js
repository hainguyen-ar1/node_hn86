import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat App API Documentation',
      version: '1.0.0',
      description: 'API documentation cho ứng dụng chat với tính năng matching và quản lý sản phẩm',
      contact: {
        name: 'API Support',
        email: 'support@chatapp.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // User schemas
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            fullName: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            phone: { type: 'string', example: '0123456789' },
            image: { type: 'string', example: 'https://example.com/avatar.jpg' },
            gender: { type: 'string', enum: ['male', 'female'], example: 'male' },
            isAdmin: { type: 'boolean', example: false },
            isOnline: { type: 'boolean', example: true },
            isWaiting: { type: 'boolean', example: false },
            currentRoom: { type: 'string', example: '507f1f77bcf86cd799439012' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password', 'phone'],
          properties: {
            fullName: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' },
            phone: { type: 'string', example: '0123456789' },
            image: { type: 'string', example: 'https://example.com/avatar.jpg' },
            gender: { type: 'string', enum: ['male', 'female'], example: 'male' }
          }
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            fullName: { type: 'string', example: 'Nguyễn Văn A' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            phone: { type: 'string', example: '0123456789' },
            gender: { type: 'string', enum: ['male', 'female'], example: 'male' }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: { type: 'string', example: 'oldpassword123' },
            newPassword: { type: 'string', example: 'newpassword123' }
          }
        },

        // Message schemas
        Message: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            roomId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            senderId: { 
              type: 'object',
              properties: {
                _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                fullName: { type: 'string', example: 'Nguyễn Văn A' },
                image: { type: 'string', example: 'https://example.com/avatar.jpg' }
              }
            },
            content: { type: 'string', example: 'Xin chào!' },
            messageType: { type: 'string', enum: ['text', 'image', 'audio'], example: 'text' },
            timestamp: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            isRead: { type: 'boolean', example: false },
            isDeleted: { type: 'boolean', example: false }
          }
        },
        SendMessageRequest: {
          type: 'object',
          required: ['roomId', 'content'],
          properties: {
            roomId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            content: { type: 'string', example: 'Xin chào!' },
            messageType: { type: 'string', enum: ['text', 'image', 'audio'], default: 'text', example: 'text' }
          }
        },
        MarkMessagesReadRequest: {
          type: 'object',
          required: ['roomId', 'messageIds'],
          properties: {
            roomId: { type: 'string', example: '507f1f77bcf86cd799439012' },
            messageIds: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012']
            }
          }
        },

        // Room schemas
        Room: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439012' },
            participants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { 
                    type: 'object',
                    properties: {
                      _id: { type: 'string', example: '507f1f77bcf86cd799439013' },
                      fullName: { type: 'string', example: 'Nguyễn Văn A' },
                      email: { type: 'string', example: 'user@example.com' },
                      image: { type: 'string', example: 'https://example.com/avatar.jpg' },
                      gender: { type: 'string', example: 'male' }
                    }
                  },
                  joinedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                  leftAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                  isActive: { type: 'boolean', example: true }
                }
              }
            },
            status: { type: 'string', enum: ['active', 'ended'], example: 'active' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            endedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            endedBy: { type: 'string', example: '507f1f77bcf86cd799439013' }
          }
        },
        LeaveRoomRequest: {
          type: 'object',
          required: ['roomId'],
          properties: {
            roomId: { type: 'string', example: '507f1f77bcf86cd799439012' }
          }
        },

        // Queue schemas
        Queue: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439013' },
            gender: { type: 'string', enum: ['male', 'female'], example: 'male' },
            status: { type: 'string', enum: ['waiting', 'matched', 'cancelled'], example: 'waiting' },
            joinedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        JoinQueueRequest: {
          type: 'object',
          required: ['gender'],
          properties: {
            gender: { type: 'string', enum: ['male', 'female'], example: 'male' }
          }
        },

        // Category schemas
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'Điện thoại' },
            image: { type: 'string', example: 'https://example.com/category.jpg' }
          }
        },
        CategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Điện thoại' },
            image: { type: 'string', example: 'https://example.com/category.jpg' }
          }
        },

        // Product schemas
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'iPhone 15 Pro' },
            name: { type: 'string', example: 'iPhone 15 Pro 128GB' },
            image: { type: 'string', example: 'https://example.com/iphone.jpg' },
            brand: { type: 'string', example: 'Apple' },
            category: { type: 'string', example: 'Điện thoại' },
            tags: { type: 'array', items: { type: 'string' }, example: ['smartphone', 'apple'] },
            salesOffer: { type: 'string', example: 'Giảm giá 10%' },
            description: { type: 'string', example: 'iPhone 15 Pro với chip A17 Pro mạnh mẽ' },
            price: { type: 'number', example: 29990000 },
            countInStock: { type: 'number', example: 50 }
          }
        },
        ProductRequest: {
          type: 'object',
          required: ['title', 'name', 'price'],
          properties: {
            title: { type: 'string', example: 'iPhone 15 Pro' },
            name: { type: 'string', example: 'iPhone 15 Pro 128GB' },
            image: { type: 'string', example: 'https://example.com/iphone.jpg' },
            brand: { type: 'string', example: 'Apple' },
            category: { type: 'string', example: 'Điện thoại' },
            tags: { type: 'array', items: { type: 'string' }, example: ['smartphone', 'apple'] },
            salesOffer: { type: 'string', example: 'Giảm giá 10%' },
            description: { type: 'string', example: 'iPhone 15 Pro với chip A17 Pro mạnh mẽ' },
            price: { type: 'number', example: 29990000 },
            countInStock: { type: 'number', example: 50 }
          }
        },

        // Order schemas
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            user: { type: 'string', example: '507f1f77bcf86cd799439013' },
            orderItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string', example: '507f1f77bcf86cd799439014' },
                  quantity: { type: 'number', example: 1 },
                  price: { type: 'number', example: 29990000 }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                address: { type: 'string', example: '123 Đường ABC' },
                city: { type: 'string', example: 'Hà Nội' },
                postalCode: { type: 'string', example: '100000' },
                country: { type: 'string', example: 'Việt Nam' }
              }
            },
            payments: {
              type: 'object',
              properties: {
                method: { type: 'string', example: 'COD' },
                status: { type: 'string', example: 'pending' }
              }
            },
            delivery: {
              type: 'object',
              properties: {
                method: { type: 'string', example: 'standard' },
                status: { type: 'string', example: 'pending' }
              }
            }
          }
        },
        OrderRequest: {
          type: 'object',
          required: ['orderItems', 'shippingAddress'],
          properties: {
            user: { type: 'string', example: '507f1f77bcf86cd799439013' },
            orderItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string', example: '507f1f77bcf86cd799439014' },
                  quantity: { type: 'number', example: 1 },
                  price: { type: 'number', example: 29990000 }
                }
              }
            },
            shippingAddress: {
              type: 'object',
              properties: {
                address: { type: 'string', example: '123 Đường ABC' },
                city: { type: 'string', example: 'Hà Nội' },
                postalCode: { type: 'string', example: '100000' },
                country: { type: 'string', example: 'Việt Nam' }
              }
            },
            payments: {
              type: 'object',
              properties: {
                method: { type: 'string', example: 'COD' },
                status: { type: 'string', example: 'pending' }
              }
            },
            delivery: {
              type: 'object',
              properties: {
                method: { type: 'string', example: 'standard' },
                status: { type: 'string', example: 'pending' }
              }
            }
          }
        },

        // Response schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Something went wrong' }
          }
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            hasNext: { type: 'boolean', example: true },
            nextCursor: { type: 'string', example: '507f1f77bcf86cd799439011' },
            limit: { type: 'number', example: 50 }
          }
        }
      }
    }
  },
  apis: ['./src/routers/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

export default specs;
