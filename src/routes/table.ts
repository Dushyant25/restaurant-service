import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/accessMiddleware';
import tableController from '../controllers/table';
import restaurantController from '../controllers/restaurant';

const router = express.Router();

router.use(authenticateUser);

// fetch all tables
router.get('/:branchId/tables', tableController.getAllTables);

// add table
 router.post('/create', authorizeRole(['manager']), restaurantController.addTables);

// update table status
router.put('/:branchId/tables/update/:tableNo', authorizeRole(['staff']), tableController.updateTableStatus);


export default router;
