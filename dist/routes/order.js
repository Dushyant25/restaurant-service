"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const accessMiddleware_1 = require("../middleware/accessMiddleware");
const order_1 = __importDefault(require("../controllers/order"));
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateUser);
// assign table / booking a table
router.post('/assign', (0, accessMiddleware_1.authorizeRole)(['staff']), order_1.default.assignTable);
// Only staff members can add items to the order
router.post('/add', (0, accessMiddleware_1.authorizeRole)(['staff']), order_1.default.addItemsToOrder);
// update items in the order
router.put('/update', (0, accessMiddleware_1.authorizeRole)(['staff']), order_1.default.updateOrder);
// calculate the total amount of an order
router.get('/:orderId/total', (0, accessMiddleware_1.authorizeRole)(['staff']), order_1.default.calculateOrderTotal);
exports.default = router;
