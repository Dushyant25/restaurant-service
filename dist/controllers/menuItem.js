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
const menuItem_1 = __importDefault(require("../service/menuItem"));
class RestaurantController {
    addToMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, description, branchId } = req.body;
                const menuItem = yield menuItem_1.default.addToMenu(branchId, name, price, description);
                res.json(menuItem);
            }
            catch (error) {
                console.error('Add to menu error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // update item
    updateMenuItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, branchId, itemId } = req.body;
                const updatedMenuItem = yield menuItem_1.default.updateMenuItem(branchId, itemId, name, price);
                res.json(updatedMenuItem);
            }
            catch (error) {
                console.error('Update menu item error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // get menu
    getMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { branchId } = req.params;
                const menu = yield menuItem_1.default.getMenu(parseInt(branchId));
                res.json(menu);
            }
            catch (error) {
                console.error('Get menu error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // delete item
    deleteMenuItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { branchId, itemId } = req.body;
                const deletedMenuItem = yield menuItem_1.default.deleteMenuItem(parseInt(branchId), parseInt(itemId));
                if (deletedMenuItem) {
                    res.json({ message: 'Menu item deleted successfully' });
                }
                else {
                    res.status(404).json({ error: 'Menu item not found or not deleted' });
                }
            }
            catch (error) {
                console.error('Delete menu item error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new RestaurantController();
