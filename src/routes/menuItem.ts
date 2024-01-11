import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/accessMiddleware';
import restaurantController from '../controllers/menuItem';

const router = express.Router();

router.use(authenticateUser);

// Only managers can add items to the menu
router.post('/menu/add', authorizeRole(['manager']), restaurantController.addToMenu);

// Only managers can update menu items
router.put('/menu/update', authorizeRole(['manager']), restaurantController.updateMenuItem);

// Allow any authenticated user to fetch the menu
router.get('/:branchId/menu', restaurantController.getMenu);

// Only managers can delete menu items (soft delete)
router.delete('/menu/delete', authorizeRole(['manager']), restaurantController.deleteMenuItem);

export default router;








