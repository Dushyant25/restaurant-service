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
const order_1 = __importDefault(require("../service/order"));
class OrderController {
    assignTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableId, branchId } = req.body;
                const result = yield order_1.default.assignTable(tableId, branchId);
                res.json(result);
            }
            catch (error) {
                console.error('Assign table error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    addItemsToOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tableId, items } = req.body;
                const result = yield order_1.default.addItemsToOrder(tableId, items);
                res.json(result);
            }
            catch (error) {
                console.error('Add items to order error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, items } = req.body;
                const result = yield order_1.default.updateOrder(orderId, items);
                res.json(result);
            }
            catch (error) {
                console.error('Update order error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    calculateOrderTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId } = req.params;
                const orderTotal = yield order_1.default.calculateOrderTotal(parseInt(orderId));
                res.json({ orderTotal });
            }
            catch (error) {
                console.error('Calculate order total error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new OrderController();
