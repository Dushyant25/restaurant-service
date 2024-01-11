import pool from '../db';

class RestaurantService {
    
  async getAffiliatedRestaurantDetails(mobileNo: string) {
    try {
      const result = await pool.query(
        'SELECT r.* FROM users u JOIN restaurants r ON u.restaurant_id = r.restaurant_id WHERE u.mobile_no = $1',
        [mobileNo]
      );

      if (result.rows.length === 0) {
        return null; // User is not affiliated with any restaurant
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error fetching affiliated restaurant details:', error);
      throw new Error('Internal Server Error');
    }
  }

// Create a new restaurant along with branch
  async createRestaurant(name: string, location: string) {
      const client = await pool.connect();
      try {
        // Start a transaction to ensure atomicity
        await client.query('BEGIN');
  
        // Check if the restaurant with the given name already exists
        const checkRestaurantQuery = 'SELECT * FROM restaurants WHERE name = $1';
        const checkRestaurantResult = await client.query(checkRestaurantQuery, [name]);
  
        let restaurantId: number;
  
        if (checkRestaurantResult.rows.length === 0) {
          // Create a new restaurant if it doesn't exist
          const createRestaurantQuery = 'INSERT INTO restaurants (name) VALUES ($1) RETURNING *';
          const createRestaurantResult = await client.query(createRestaurantQuery, [name]);
          const newRestaurant = createRestaurantResult.rows[0];
          restaurantId = newRestaurant.restaurant_id;
        } else {
          // Use the existing restaurant ID if it already exists
          restaurantId = checkRestaurantResult.rows[0].restaurant_id;
        }
  
        // Create a branch for the restaurant
        const createBranchQuery =
          'INSERT INTO branches (restaurant_id, location) VALUES ($1, $2) RETURNING *';
        const createBranchResult = await client.query(createBranchQuery, [restaurantId, location]);
        const createdBranch = createBranchResult.rows[0];
  
        // Commit the transaction
        await client.query('COMMIT');
  
        return  createdBranch;

      } catch (error) {
        // Rollback the transaction in case of an error
        await client.query('ROLLBACK');
        console.error('Create restaurant with branch error:', error);
        throw new Error('Internal Server Error');
      } finally {
        client.release();
      }

  }
 // Create 10 tables for the restaurant branch by default
 async createTablesForRestaurant(branchId: number, numberOfTables: number=10) {
  try {
    const createTablesQuery =
      'INSERT INTO tables (branch_id, status, table_number) VALUES ($1, $2, $3) RETURNING *';
    const createdTables = await Promise.all(
      Array.from({ length: numberOfTables }).map(async (_, index) => {
        const createTableResult = await pool.query(createTablesQuery, [branchId, 'free', index + 1]);
        return createTableResult.rows[0];
      })
    );

    return createdTables;
  } catch (error) {
    console.error('Create tables for restaurant error:', error);
    throw new Error('Internal Server Error');
  }
}
}

export default new RestaurantService();

