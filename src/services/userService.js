import bcrypt from 'bcryptjs';
import { UserModel } from '../models/schema/user_model.js';
import { generateToken } from '../middleware/auth.js';
import { AppError } from '../utils/errorHandler.js';

export class UserService {
  static async createUser(userData) {
    const { email, password, ...otherData } = userData;
    
    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 12);
    
    // Create user
    const user = await UserModel.create({
      ...otherData,
      email,
      password: hashedPassword
    });

    console.log(`User created: ${user.email}`);
    return user;
  }

  static async authenticateUser(email, password) {
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user._id);
    console.log(`User logged in: ${user.email}`);
    
    return { user, token };
  }

  static async updateUser(userId, updateData) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Update fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    const updatedUser = await user.save();
    console.log(`User updated: ${updatedUser.email}`);
    return updatedUser;
  }

  static async changePassword(userId, oldPassword, newPassword) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new AppError('Invalid old password', 401);
    }

    user.password = bcrypt.hashSync(newPassword, 12);
    await user.save();
    
    console.log(`Password changed for user: ${user.email}`);
    return user;
  }

  static async deleteUser(userId) {
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    console.log(`User deleted: ${user.email}`);
    return user;
  }
} 