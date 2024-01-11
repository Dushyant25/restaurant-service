"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class RestaurantService {
    getAffiliatedRestaurantDetails(mobileNo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query('SELECT r.* FROM users u JOIN restaurants r ON u.restaurant_id = r.restaurant_id WHERE u.mobile_no = $1', [mobileNo]);
                if (result.rows.length === 0) {
                    return null; // User is not affiliated with any restaurant
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Error fetching affiliated restaurant details:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    // Create a new restaurant along with branch
    createRestaurant(name, location) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.default.connect();
            try {
                // Start a transaction to ensure atomicity
                yield client.query('BEGIN');
                // Check if the restaurant with the given name already exists
                const checkRestaurantQuery = 'SELECT * FROM restaurants WHERE name = $1';
                const checkRestaurantResult = yield client.query(checkRestaurantQuery, [name]);
                let restaurantId;
                if (checkRestaurantResult.rows.length === 0) {
                    // Create a new restaurant if it doesn't exist
                    const createRestaurantQuery = 'INSERT INTO restaurants (name) VALUES ($1) RETURNING *';
                    const createRestaurantResult = yield client.query(createRestaurantQuery, [name]);
                    const newRestaurant = createRestaurantResult.rows[0];
                    restaurantId = newRestaurant.restaurant_id;
                }
                else {
                    // Use the existing restaurant ID if it already exists
                    restaurantId = checkRestaurantResult.rows[0].restaurant_id;
                }
                // Create a branch for the restaurant
                const createBranchQuery = 'INSERT INTO branches (restaurant_id, location) VALUES ($1, $2) RETURNING *';
                const createBranchResult = yield client.query(createBranchQuery, [restaurantId, location]);
                const createdBranch = createBranchResult.rows[0];
                // Commit the transaction
                yield client.query('COMMIT');
                return createdBranch;
            }
            catch (error) {
                // Rollback the transaction in case of an error
                yield client.query('ROLLBACK');
                console.error('Create restaurant with branch error:', error);
                throw new Error('Internal Server Error');
            }
            finally {
                client.release();
            }
        });
    }
    // Create 10 tables for the restaurant branch by default
    createTablesForRestaurant(branchId, numberOfTables = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createTablesQuery = 'INSERT INTO tables (branch_id, status, table_number) VALUES ($1, $2, $3) RETURNING *';
                const createdTables = yield Promise.all(Array.from({ length: numberOfTables }).map((_, index) => __awaiter(this, void 0, void 0, function* () {
                    const createTableResult = yield db_1.default.query(createTablesQuery, [branchId, 'free', index + 1]);
                    return createTableResult.rows[0];
                })));
                return createdTables;
            }
            catch (error) {
                console.error('Create tables for restaurant error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.default = new RestaurantService();
