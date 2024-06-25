import { Request, Response } from 'express';
import UserService from '../services/userService';
import { error } from 'console';

class UserController {
  // Method to handle the request to fetch a user by Google ID from request body
  async getUserById(req: Request, res: Response): Promise<void> {
    const { googleId } = req.body;

    if (!googleId) {
      res.status(400).json({ message: 'Google ID is required' });
      return;
    }

    try {
      const user = await UserService.fetchUserById(googleId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error });
    }
  }
  async reconfigureOrCreateUserStocks(req: Request, res: Response){
    const { googleId, stocks } = req.body;

    try {
      const subscription = await UserService.reconfigureOrCreateUserStocks(googleId, stocks);
      res.status(200).json(subscription);
    } catch (error) {
      res.status(500).json({ message: 'Failed to reconfigure or create user stocks', error: error });
    }
  }
  // Method to handle the request to save a user
  async saveUser(req: Request, res: Response): Promise<void> {
    try {
      const userInfo = req.body;


      const user = await UserService.saveUser(userInfo);

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error saving user', error: error});
    }
  }
  async fetchUserStocks(req: Request, res: Response) {
    console.log(req.params)
    const { googleId } = req.params;
  
    try {
      if (!googleId) {
        return res.status(400).json({ message: 'Google ID is required' });
      }
  
      const userStocks = await UserService.fetchUserStocks(googleId);
  
      if (!userStocks) {
        return res.status(404).json({ message: 'No stock subscriptions found for the user' });
      }
  
      res.status(200).json(userStocks);
    } catch (error) {
      console.error('Error fetching user stocks:', error);
      res.status(500).json({ message: 'Failed to fetch user stocks', error: error });
    }
  }

}

export default new UserController();
