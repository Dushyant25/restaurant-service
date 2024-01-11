"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const accessMiddleware_1 = require("../middleware/accessMiddleware");
const table_1 = __importDefault(require("../controllers/table"));
const restaurant_1 = __importDefault(require("../controllers/restaurant"));
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateUser);
// fetch all tables
router.get('/:branchId/tables', table_1.default.getAllTables);
// add table
router.post('/create', (0, accessMiddleware_1.authorizeRole)(['manager']), restaurant_1.default.addTables);
// update table status
router.put('/:branchId/tables/update/:tableNo', (0, accessMiddleware_1.authorizeRole)(['staff']), table_1.default.updateTableStatus);
exports.default = router;
