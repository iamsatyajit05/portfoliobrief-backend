import jwt from 'jsonwebtoken';
import config from '../config';
import User, { UserDocument } from '../models/userModel';
import { comparePasswords, hashPassword } from '../utils/bcryptUtils';
import { generateToken } from '../utils/token';
import { StockSubscriptionDocument } from '../models/stockSubscriptionModel';
import StockSubscription from '../models/stockSubscriptionModel';
import mongoose from 'mongoose';
class UserService {
  // Method to fetch user by Google ID
  async reconfigureOrCreateUserStocks(googleId: string, stocks: string[]): Promise<StockSubscriptionDocument> {
    try {
      const subscription = await StockSubscription.findOneAndUpdate(
        { userId:googleId },
        { stocks }, // Replace the existing stocks array with the new one
        { new: true, upsert: true }
      );
      return subscription;
    } catch (error) {
      console.error('Error reconfiguring or creating user stocks:', error);
      throw error;
    }
  }
  async fetchUserById(googleId: string): Promise<UserDocument | null> {
    try {
      const user = await User.findOne({ googleId }).exec();

      if (!user) {
        console.log('User not found');
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user by ID');
    }
  }

  // Method to save a user
  async saveUser(userInfo: any): Promise<UserDocument> {
    try {

      const userDetails: Partial<UserDocument> = {
        googleId: userInfo.googleId,
        name: userInfo.name,
        email: userInfo.email,
        emailVerified: userInfo.emailVerified,
        picture: userInfo.picture,
        providerId: userInfo.providerId,
      };

      // Check if the user already exists
      let existingUser = await User.findOne({ googleId: userInfo.googleId });

      if (existingUser) {
        // Update existing user 
        existingUser = Object.assign(existingUser, userDetails);
        const updatedUser = await existingUser.save();
        return updatedUser;
      } else {
        // Create a new user
        console.log('helo')
        let savedUser = await User.create(userDetails);
        return savedUser;
      }
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }
  }
  async fetchUserStocks(userId: string): Promise<StockSubscriptionDocument | null> {
    try {
      const subscription = await StockSubscription.findOne({ userId });
      return subscription;
    } catch (error) {
      console.error('Error fetching user stocks:', error);
      throw error;
    }
  }
}

export default new UserService();
