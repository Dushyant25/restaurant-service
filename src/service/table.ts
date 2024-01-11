import pool from '../db';

class TableService {
  async getAllTables(branchId: number) {
    try {
      const getAllTablesQuery = 'SELECT * FROM tables WHERE branch_id = $1';
      const result = await pool.query(getAllTablesQuery, [branchId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching all tables:', error);
      throw new Error('Internal Server Error');
    }
  }

  async updateTableStatus(branchId: number, tableNo: number, status: string) {
    try {
      const updateTableStatusQuery = 'UPDATE tables SET status = $1 WHERE branch_id = $2 AND table_number = $3 RETURNING *';
      const result = await pool.query(updateTableStatusQuery, [status, branchId, tableNo]);

      if (result.rows.length === 0) {
        return null; // Table not found or not updated
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating table status:', error);
      throw new Error('Internal Server Error');
    }
  }
}

export default new TableService();
