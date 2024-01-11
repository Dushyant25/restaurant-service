// paymentController.ts
import { Request, Response } from 'express';
import paymentService from '../service/payment';

class PaymentController {
  async makePayment(req: Request, res: Response) {
    try {
        const { orderId, amount, branchId, tableId } = req.body;
      const paymentResult = await paymentService.makePayment(orderId, amount, branchId, tableId);

      res.json(paymentResult);
    } catch (error) {
      console.error('Make payment error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new PaymentController();
