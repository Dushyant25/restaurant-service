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
    addToMenu(branchId, name, price, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const insertMenuItemQuery = 'INSERT INTO menu_items (branch_id, name, price, description, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *';
                const result = yield db_1.default.query(insertMenuItemQuery, [branchId, name, price, description, true]);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error adding to menu:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    updateMenuItem(branchId, itemId, name, price) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateMenuItemQuery = 'UPDATE menu_items SET name = $1, price = $2 WHERE branch_id = $3 AND item_id = $4 RETURNING *';
                const result = yield db_1.default.query(updateMenuItemQuery, [name, price, branchId, itemId]);
                if (result.rows.length === 0) {
                    return { message: 'No such item is found' };
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Error updating menu item:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    getMenu(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMenuQuery = 'SELECT * FROM menu_items WHERE branch_id = $1';
                const result = yield db_1.default.query(getMenuQuery, [branchId]);
                return result.rows;
            }
            catch (error) {
                console.error('Error fetching menu:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    deleteMenuItem(branchId, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteMenuItemQuery = 'UPDATE menu_items SET is_active = false WHERE branch_id = $1 AND item_id = $2 RETURNING *';
                const result = yield db_1.default.query(deleteMenuItemQuery, [branchId, itemId]);
                if (result.rows.length === 0) {
                    return { message: 'Item not found or not deleted' };
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Error deleting menu item:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.default = new RestaurantService();
