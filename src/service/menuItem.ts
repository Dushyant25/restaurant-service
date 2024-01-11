import pool from '../db';

class RestaurantService {
  async addToMenu(branchId: number, name: string, price: number,description: string) {
    try {
      const insertMenuItemQuery = 'INSERT INTO menu_items (branch_id, name, price, description, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const result = await pool.query(insertMenuItemQuery, [branchId, name, price, description, true]);

      return result.rows[0];
    } catch (error) {
      console.error('Error adding to menu:', error);
      throw new Error('Internal Server Error');
    }
  }

  async updateMenuItem(branchId: number, itemId: number, name: string, price: number) {
    try {
      const updateMenuItemQuery = 'UPDATE menu_items SET name = $1, price = $2 WHERE branch_id = $3 AND item_id = $4 RETURNING *';
      const result = await pool.query(updateMenuItemQuery, [name, price, branchId, itemId]);

      if (result.rows.length === 0) {
        return {message: 'No such item is found'}; 
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error('Internal Server Error');
    }
  }

  async getMenu(branchId: number) {
    try {
      const getMenuQuery = 'SELECT * FROM menu_items WHERE branch_id = $1';
      const result = await pool.query(getMenuQuery, [branchId]);

      return result.rows;
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw new Error('Internal Server Error');
    }
  }

  async deleteMenuItem(branchId: number, itemId: number) {
    try {
      const deleteMenuItemQuery = 'UPDATE menu_items SET is_active = false WHERE branch_id = $1 AND item_id = $2 RETURNING *';
      const result = await pool.query(deleteMenuItemQuery, [branchId, itemId]);

      if (result.rows.length === 0) {
        return {message: 'Item not found or not deleted'};
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw new Error('Internal Server Error');
    }
  }
  
}

export default new RestaurantService();


