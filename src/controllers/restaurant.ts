import { Request, Response } from 'express';
import restaurantService from '../service/restaurant';

class RestaurantController {
// create restaurent 
  async createRestaurant(req: Request, res: Response) {
    try {
      const { name,location } = req.body;
      const newRestaurant = await restaurantService.createRestaurant(name, location);
      let numberOfTables =10;// by default 10 tables will be created 
      const createdTables = await restaurantService.createTablesForRestaurant(newRestaurant.branch_id, numberOfTables);

      res.json({
        restaurant: newRestaurant,
        tables: createdTables,
      });
    } catch (error) {
      console.error('Create restaurant with tables error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // add tables
  async addTables(req: Request, res: Response) {
    try {
      const { branchId,numberOfTables } = req.body;
      const createdTables = await restaurantService.createTablesForRestaurant(branchId, numberOfTables);
      res.json(createdTables);
    } catch (error) {
      console.error('Create restaurant with tables error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new RestaurantController();
