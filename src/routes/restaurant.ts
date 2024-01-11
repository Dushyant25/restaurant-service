import express from 'express';
import restaurantController from '../controllers/restaurant';
const router = express.Router();

// create restaurants
router.post('/create', restaurantController.createRestaurant);

export default router;

