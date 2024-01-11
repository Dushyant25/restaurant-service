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
class PaymentService {
    makePayment(orderId, amount, branchId, tableId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Start a transaction to ensure atomicity
                yield db_1.default.query('BEGIN');
                // Update the order status to 'completed' and record payment details
                const insertPaymentQuery = 'INSERT INTO payments (order_id, amount, payment_status, payment_date) VALUES ($1, $2, $3, NOW()) RETURNING *';
                const updateOrderStatusQuery = 'UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *';
                const updateTableStatusQuery = 'UPDATE tables SET status = $1 WHERE branch_id = $2 AND table_id = $3';
                const [insertPaymentResult, updateOrderStatusResult, updateTableStatusResult] = yield Promise.all([
                    db_1.default.query(insertPaymentQuery, [orderId, amount, 'paid']),
                    db_1.default.query(updateOrderStatusQuery, ['closed', orderId]),
                    db_1.default.query(updateTableStatusQuery, ['free', branchId, tableId])
                ]);
                // Commit the transaction
                yield db_1.default.query('COMMIT');
                return {
                    payment: insertPaymentResult.rows[0],
                    order: updateOrderStatusResult.rows[0],
                    table: updateTableStatusResult.rows[0]
                };
            }
            catch (error) {
                // Rollback the transaction in case of an error
                yield db_1.default.query('ROLLBACK');
                console.error('Error finalizing order:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.default = new PaymentService();
