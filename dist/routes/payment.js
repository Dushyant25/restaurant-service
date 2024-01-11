"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const accessMiddleware_1 = require("../middleware/accessMiddleware");
const payment_1 = __importDefault(require("../controllers/payment"));
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateUser);
// make entry of payment 
router.post('/make', (0, accessMiddleware_1.authorizeRole)(['manager']), payment_1.default.makePayment);
exports.default = router;
