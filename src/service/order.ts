import pool from '../db';

class TableService {
  async assignTable(tableId: number, branchId:number) {
    try {
      const updateTableStatusQuery = 'UPDATE tables SET status = $1 WHERE branch_id = $2 AND table_id = $3'; 
      await pool.query(updateTableStatusQuery, ['occupied',branchId, tableId]);

      // query to insert order 
      const insertOrderQuery = 'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING *';
      const result = await pool.query(insertOrderQuery, [tableId, 'open']);

      return result.rows;
    } catch (error) {
      console.error('Error assigning table:', error);
      throw new Error('Internal Server Error');
    }
  }

  async addItemsToOrder(tableId: string, items: { itemId: string; quantity: number }[]) {
    try {
      // Get the existing order for the table
      const existingOrderQuery = 'SELECT * FROM orders WHERE table_id = $1 AND status = $2';
      const existingOrderResult = await pool.query(existingOrderQuery, [tableId, 'open']);
  
      let orderId: number;
      if (existingOrderResult.rows.length === 0) {
        // If no existing order, create a new order for the table
        const createOrderQuery = 'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING order_id';
        const createOrderResult = await pool.query(createOrderQuery, [tableId, 'open']);
        orderId = createOrderResult.rows[0].order_id;
      } else {
        orderId = existingOrderResult.rows[0].order_id;
      }
  
      // Insert the items into the order_items table
      const insertOrderItemsQuery =
        'INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *';
  
      const insertOrderItemsResult = await Promise.all(
        items.map((item) => pool.query(insertOrderItemsQuery, [orderId, item.itemId, item.quantity]))
      );
  
      return insertOrderItemsResult.map((result) => result.rows[0]);
    } catch (error) {
      console.error('Error adding items to order:', error);
      throw new Error('Internal Server Error');
    }
  }
  

  async updateOrder(orderId: number, items: { itemId: string; quantity: number }[]) {
    try {
      // Delete existing items from the order_items table
      const deleteOrderItemsQuery = 'DELETE FROM order_items WHERE order_id = $1';
      await pool.query(deleteOrderItemsQuery, [orderId]);

      // Insert the new items into the order_items table
      const insertOrderItemsQuery = 'INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *';
      const insertOrderItemsResult = await Promise.all(
        items.map((item) => pool.query(insertOrderItemsQuery, [orderId, item.itemId, item.quantity]))
      );

      return insertOrderItemsResult.map(result => result.rows[0]);
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('Internal Server Error');
    }
  }

  // Calculate total amount of a order 
  async calculateOrderTotal(orderId: number) {
    try {
      const calculateTotalQuery = `
        SELECT
          mi.name as item_name,
          mi.price as item_price,
          oi.quantity,
          (oi.quantity * mi.price) as item_total
        FROM order_items oi
        JOIN menu_items mi ON oi.item_id = mi.item_id
        WHERE oi.order_id = $1
      `;
      const calculateTotalResult = await pool.query(calculateTotalQuery, [orderId]);

      const orderTotalDetails = {
        items: calculateTotalResult.rows,
        total: calculateTotalResult.rows.reduce((acc, item) => acc + parseInt(item.item_total), 0) || 0,
      };

      return orderTotalDetails;
    } catch (error) {
      console.error('Calculate order total with details error:', error);
      throw new Error('Internal Server Error');
    }
  }
 
 
 
}

export default new TableService();
