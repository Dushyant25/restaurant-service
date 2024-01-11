// restaurantController.ts
import { Request, Response } from 'express';
import restaurantService from '../service/menuItem';

class RestaurantController {
  async addToMenu(req: Request, res: Response) {
    try {
      const { name, price, description,branchId } = req.body;
      const menuItem = await restaurantService.addToMenu(branchId, name, price, description);
      res.json(menuItem);
    } catch (error) {
      console.error('Add to menu error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // update item
  async updateMenuItem(req: Request, res: Response) {
    try {
      const { name, price, branchId, itemId  } = req.body;
      const updatedMenuItem = await restaurantService.updateMenuItem(branchId, itemId, name, price);
      res.json(updatedMenuItem);
    } catch (error) {
      console.error('Update menu item error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // get menu
  async getMenu(req: Request, res: Response) {
    try {
      const { branchId } = req.params;
      const menu = await restaurantService.getMenu(parseInt(branchId));
      res.json(menu);
    } catch (error) {
      console.error('Get menu error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

// delete item
  async deleteMenuItem(req: Request, res: Response) {
    try {
      const { branchId, itemId } = req.body;
      const deletedMenuItem = await restaurantService.deleteMenuItem(parseInt(branchId), parseInt(itemId));

      if (deletedMenuItem) {
        res.json({ message: 'Menu item deleted successfully' });
      } else {
        res.status(404).json({ error: 'Menu item not found or not deleted' });
      }
    } catch (error) {
      console.error('Delete menu item error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new RestaurantController();


