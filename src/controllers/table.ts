import { Request, Response } from 'express';
import tableService from '../service/table';

class TableController {
  async getAllTables(req: Request, res: Response) {
    try {
      const { branchId } = req.params;
      const tables = await tableService.getAllTables(parseInt(branchId));
      res.json(tables);
    } catch (error) {
      console.error('Get all tables error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateTableStatus(req: Request, res: Response) {
    try {
      const { branchId, tableNo } = req.params;
      const { status } = req.body;
      const updatedTable = await tableService.updateTableStatus(parseInt(branchId), parseInt(tableNo), status);

      if (updatedTable) {
        res.json(updatedTable);
      } else {
        res.status(404).json({ error: 'Table not found or not updated' });
      }
    } catch (error) {
      console.error('Update table status error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new TableController();
