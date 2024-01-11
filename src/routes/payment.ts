
import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/accessMiddleware';
import PaymentController from '../controllers/payment';

const router = express.Router();

router.use(authenticateUser);

// make entry of payment 
router.post('/make', authorizeRole(['staff']), PaymentController.makePayment);

export default router;
