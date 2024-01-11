import pool from '../db';

class PaymentService {
  async makePayment(orderId: number, amount: number, branchId: number, tableId: number) {
    try {
      // Start a transaction to ensure atomicity
      await pool.query('BEGIN');
  
      // Update the order status to 'completed' and record payment details
      const insertPaymentQuery = 'INSERT INTO payments (order_id, amount, payment_status, payment_date) VALUES ($1, $2, $3, NOW()) RETURNING *';
      const updateOrderStatusQuery = 'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *';
      const updateTableStatusQuery = 'UPDATE tables SET status = $1 WHERE branch_id = $2 AND table_id = $3 RETURNING *';
  
      const [insertPaymentResult, updateOrderStatusResult, updateTableStatusResult] = await Promise.all([
        pool.query(insertPaymentQuery, [orderId, amount, 'paid']),
        pool.query(updateOrderStatusQuery, ['closed', orderId]),
        pool.query(updateTableStatusQuery, ['free', branchId, tableId])
      ]);

      // Commit the transaction
      await pool.query('COMMIT');
  
      return {
        payment: insertPaymentResult.rows[0],
        order: updateOrderStatusResult.rows[0],
        table: updateTableStatusResult.rows[0]
      };
    } catch (error) {
      // Rollback the transaction in case of an error
      await pool.query('ROLLBACK');
      console.error('Error finalizing order:', error);
      throw new Error('Internal Server Error');
    }
  }
  
}

export default new PaymentService();



   
  