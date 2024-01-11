import { Request, Response } from 'express';
import orderService from '../service/order';

class OrderController {
  async assignTable(req: Request, res: Response) {
    try {
      const { tableId, branchId } = req.body;
      const result = await orderService.assignTable(tableId, branchId);
      res.json(result);
    } catch (error) {
      console.error('Assign table error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async addItemsToOrder(req: Request, res: Response) {
    try {
      const { tableId, items } = req.body;
      const result = await orderService.addItemsToOrder(tableId, items);
      res.json(result);
    } catch (error) {
      console.error('Add items to order error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateOrder(req: Request, res: Response) {
    try {
      const { orderId, items } = req.body;
      const result = await orderService.updateOrder(orderId, items);
      res.json(result);
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async calculateOrderTotal(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const orderTotal = await orderService.calculateOrderTotal(parseInt(orderId));

      res.json({ orderTotal });
    } catch (error) {
      console.error('Calculate order total error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}

export default new OrderController();
