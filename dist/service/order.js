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
class TableService {
    assignTable(tableId, branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateTableStatusQuery = 'UPDATE tables SET status = $1 WHERE branch_id = $2 AND table_id = $3';
                yield db_1.default.query(updateTableStatusQuery, ['occupied', branchId, tableId]);
                // query to insert order 
                const insertOrderQuery = 'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING *';
                const result = yield db_1.default.query(insertOrderQuery, [tableId, 'open']);
                return result.rows;
            }
            catch (error) {
                console.error('Error assigning table:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    addItemsToOrder(tableId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get the existing order for the table
                const existingOrderQuery = 'SELECT * FROM orders WHERE table_id = $1 AND status = $2';
                const existingOrderResult = yield db_1.default.query(existingOrderQuery, [tableId, 'open']);
                let orderId;
                if (existingOrderResult.rows.length === 0) {
                    // If no existing order, create a new order for the table
                    const createOrderQuery = 'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING order_id';
                    const createOrderResult = yield db_1.default.query(createOrderQuery, [tableId, 'open']);
                    orderId = createOrderResult.rows[0].order_id;
                }
                else {
                    orderId = existingOrderResult.rows[0].order_id;
                }
                // Insert the items into the order_items table
                const insertOrderItemsQuery = 'INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *';
                const insertOrderItemsResult = yield Promise.all(items.map((item) => db_1.default.query(insertOrderItemsQuery, [orderId, item.itemId, item.quantity])));
                return insertOrderItemsResult.map((result) => result.rows[0]);
            }
            catch (error) {
                console.error('Error adding items to order:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    updateOrder(orderId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete existing items from the order_items table
                const deleteOrderItemsQuery = 'DELETE FROM order_items WHERE order_id = $1';
                yield db_1.default.query(deleteOrderItemsQuery, [orderId]);
                // Insert the new items into the order_items table
                const insertOrderItemsQuery = 'INSERT INTO order_items (order_id, item_id, quantity) VALUES ($1, $2, $3) RETURNING *';
                const insertOrderItemsResult = yield Promise.all(items.map((item) => db_1.default.query(insertOrderItemsQuery, [orderId, item.itemId, item.quantity])));
                return insertOrderItemsResult.map(result => result.rows[0]);
            }
            catch (error) {
                console.error('Error updating order:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    // Calculate total amount of a order 
    calculateOrderTotal(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const calculateTotalResult = yield db_1.default.query(calculateTotalQuery, [orderId]);
                const orderTotalDetails = {
                    items: calculateTotalResult.rows,
                    total: calculateTotalResult.rows.reduce((acc, item) => acc + parseInt(item.item_total), 0) || 0,
                };
                return orderTotalDetails;
            }
            catch (error) {
                console.error('Calculate order total with details error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.default = new TableService();
