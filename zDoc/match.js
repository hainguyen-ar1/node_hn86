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