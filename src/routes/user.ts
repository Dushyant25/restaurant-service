import express from 'express';
import userController from '../controllers/user';

const router = express.Router();

// get userDetails 
router.get('/:userId', userController.getUserById);
// register/create new user
router.post('/create', userController.createUser);
// login user
router.post('/login', userController.loginUser);

export default router;