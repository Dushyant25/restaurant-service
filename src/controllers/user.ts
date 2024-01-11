import { Request, Response } from 'express';
import userService from '../service/user';

class UserController {
  async getUserById(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { mobileNo, password, userName, role, branch_id } = req.body;
      const user = await userService.createUser({mobileNo, password, userName, role, branch_id});
      res.json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { mobileNo, password } = req.body;
      const user = await userService.loginUser(mobileNo, password);
      res.json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


}

export default new UserController();