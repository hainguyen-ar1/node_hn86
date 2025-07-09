Dưới đây là nội dung thiết kế cơ sở dữ liệu MongoDB cho ứng dụng chat ẩn danh, được biểu diễn dưới dạng các **class** trong JavaScript (sử dụng Mongoose) và giải thích chi tiết, được định dạng thành file Markdown.



# Thiết Kế Cơ Sở Dữ Liệu MongoDB cho Ứng Dụng Chat Ẩn Danh

Đây là thiết kế cơ sở dữ liệu MongoDB cho ứng dụng chat ẩn danh với tính năng match theo hàng chờ giữa hai người khác giới. Thiết kế sử dụng các **class** trong JavaScript (qua Mongoose) để quản lý người dùng, hàng chờ, phiên chat và tin nhắn, đảm bảo tính ẩn danh nhưng vẫn hỗ trợ quản lý thông tin người dùng một cách bảo mật.

## Thiết Kế Các Class

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Class User: Quản lý thông tin người dùng
const UserSchema = new Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true, // ID ẩn danh duy nhất, ví dụ: "User123"
    index: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Lưu email để quản lý, nhưng không hiển thị
    select: false // Không trả về trong các truy vấn mặc định
  },
  hashedPassword: {
    type: String,
    required: true,
    select: false // Bảo mật mật khẩu
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'in_queue', 'in_chat'],
    default: 'offline'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// Class Queue: Quản lý hàng chờ để match người dùng
const QueueSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now,
    index: true // Index để sắp xếp theo thời gian tham gia
  }
});

const Queue = mongoose.model('Queue', QueueSchema);

// Class Chat: Quản lý phiên chat giữa hai người
const ChatSchema = new Schema({
  user1Id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2Id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active',
    index: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  }
});

const Chat = mongoose.model('Chat', ChatSchema);

// Class Message: Quản lý tin nhắn trong phiên chat
const MessageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const Message = mongoose.model('Message', MessageSchema);
```

## Giải Thích Thiết Kế

1. **User (Người dùng)**:
   - `anonymousId`: ID ẩn danh duy nhất hiển thị trong chat (ví dụ: "User123"), đảm bảo không để lộ danh tính.
   - `gender`: Giới tính ("male" hoặc "female") để hỗ trợ match khác giới.
   - `email` và `hashedPassword`: Lưu thông tin đăng nhập để quản lý người dùng, nhưng không trả về trong truy vấn mặc định (`select: false`) để bảo mật.
   - `status`: Theo dõi trạng thái người dùng (online, offline, in_queue, in_chat).
   - `createdAt`: Thời gian tạo tài khoản để quản lý.

2. **Queue (Hàng chờ)**:
   - `userId`: Liên kết với `User` để xác định người dùng trong hàng chờ.
   - `gender`: Lưu giới tính để hỗ trợ thuật toán match khác giới.
   - `joinedAt`: Thời gian tham gia hàng chờ, dùng để ưu tiên match theo thứ tự (người vào sớm hơn được ưu tiên).

3. **Chat (Phiên chat)**:
   - `user1Id` và `user2Id`: Liên kết với hai người dùng trong phiên chat.
   - `status`: Trạng thái phiên chat ("active" hoặc "ended").
   - `startedAt` và `endedAt`: Quản lý thời gian của phiên chat.

4. **Message (Tin nhắn)**:
   - `chatId`: Liên kết với phiên chat cụ thể.
   - `senderId`: Xác định người gửi tin nhắn.
   - `content`: Nội dung tin nhắn.
   - `sentAt`: Thời gian gửi tin nhắn.

## Luồng Match

1. Người dùng đăng nhập (sử dụng `email` và `hashedPassword`), nhận `anonymousId` để ẩn danh trong chat.
2. Người dùng vào hàng chờ → Tạo bản ghi trong `Queue` với `userId`, `gender`, và `joinedAt`.
3. Hệ thống tìm người khác giới sớm nhất trong `Queue` (sử dụng index trên `gender` và `joinedAt`).
4. Khi match thành công, tạo bản ghi trong `Chat`, xóa cả hai người khỏi `Queue`, cập nhật `status` trong `User` thành "in_chat".
5. Tin nhắn được lưu vào `Message` với liên kết đến `Chat`.

## Tối Ưu Hóa

- **Index**: Đặt index trên `User.anonymousId`, `Queue.userId`, `Queue.joinedAt`, `Chat.status`, và `Message.chatId` để tăng tốc truy vấn.
- **Bảo mật**: Sử dụng `select: false` cho `email` và `hashedPassword` để không trả về thông tin nhạy cảm trong API.
- **Ẩn danh**: Chỉ sử dụng `anonymousId` trong giao diện chat, không để lộ `email` hay thông tin cá nhân.
- **Xóa dữ liệu**: Định kỳ xóa các phiên chat đã kết thúc (`Chat.status: "ended"`) và tin nhắn liên quan để tiết kiệm không gian.

## Ví Dụ Truy Vấn Match

```javascript
async function matchUser(userId) {
  const user = await User.findById(userId);
  if (!user || user.status !== 'in_queue') return;

  // Thêm người dùng vào hàng chờ
  await Queue.create({ userId, gender: user.gender });

  // Tìm người khác giới sớm nhất trong hàng chờ
  const oppositeGender = user.gender === 'male' ? 'female' : 'male';
  const match = await Queue.findOne({ gender: oppositeGender })
    .sort({ joinedAt: 1 }); // Lấy người vào sớm nhất

  if (match) {
    // Tạo phiên chat
    const chat = await Chat.create({
      user1Id: userId,
      user2Id: match.userId
    });

    // Xóa cả hai khỏi hàng chờ
    await Queue.deleteMany({ userId: { $in: [userId, match.userId] } });

    // Cập nhật trạng thái
    await User.updateMany(
      { _id: { $in: [userId, match.userId] } },
      { status: 'in_chat' }
    );

    return chat;
  }
}
```

## Lưu Ý

- Để tăng tính bảo mật, sử dụng thư viện như `bcrypt` để mã hóa `hashedPassword`.
- Có thể thêm trường `isActive` trong `User` để quản lý tài khoản bị khóa.
- Nếu cần lưu thêm thông tin (ví dụ: sở thích để match), mở rộng `UserSchema` nhưng đảm bảo không để lộ thông tin cá nhân trong giao diện chat.

