"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const accessMiddleware_1 = require("../middleware/accessMiddleware");
const menuItem_1 = __importDefault(require("../controllers/menuItem"));
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateUser);
// Only managers can add items to the menu
router.post('/menu/add', (0, accessMiddleware_1.authorizeRole)(['manager']), menuItem_1.default.addToMenu);
// Only managers can update menu items
router.put('/menu/update', (0, accessMiddleware_1.authorizeRole)(['manager']), menuItem_1.default.updateMenuItem);
// Allow any authenticated user to fetch the menu
router.get('/:branchId/menu', menuItem_1.default.getMenu);
// Only managers can delete menu items (soft delete)
router.delete('/menu/delete', (0, accessMiddleware_1.authorizeRole)(['manager']), menuItem_1.default.deleteMenuItem);
exports.default = router;
