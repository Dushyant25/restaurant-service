import express from 'express';
import userRoute from './user';
import restaurantRoute from './restaurant';
import tableRoute from './table';
import menuItemRoute from './menuItem';
import orderRoute from './order';
import paymentRoute from './payment';

const router = express.Router();

router.use('/restaurants', restaurantRoute);
router.use('/tables', tableRoute);
router.use('/menu-items', menuItemRoute);
router.use('/orders', orderRoute);
router.use('/payments', paymentRoute);
router.use('/user', userRoute);

export default router;