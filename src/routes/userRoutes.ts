import { Router } from 'express';
import UserController from '../controllers/userController';

const router = Router();
// Route to get user by Google ID
router.post('/fetchById', UserController.getUserById);

// Route to save user
router.post('/save', UserController.saveUser);

router.post('/stocks', UserController.reconfigureOrCreateUserStocks)

export default router;
