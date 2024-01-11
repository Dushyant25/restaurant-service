import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/accessMiddleware';
import OrderController from '../controllers/order';

const router = express.Router();

router.use(authenticateUser);

// assign table / booking a table
router.post('/assign', authorizeRole(['staff']), OrderController.assignTable);

// Only staff members can add items to the order
router.post('/add', authorizeRole(['staff']), OrderController.addItemsToOrder);

// update items in the order
router.put('/update', authorizeRole(['staff']), OrderController.updateOrder);

// calculate the total amount of an order
router.get('/:orderId/total', authorizeRole(['staff']), OrderController.calculateOrderTotal);




export default router;


