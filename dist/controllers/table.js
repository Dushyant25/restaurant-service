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
const table_1 = __importDefault(require("../service/table"));
class TableController {
    getAllTables(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { branchId } = req.params;
                const tables = yield table_1.default.getAllTables(parseInt(branchId));
                res.json(tables);
            }
            catch (error) {
                console.error('Get all tables error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    updateTableStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { branchId, tableNo } = req.params;
                const { status } = req.body;
                const updatedTable = yield table_1.default.updateTableStatus(parseInt(branchId), parseInt(tableNo), status);
                if (updatedTable) {
                    res.json(updatedTable);
                }
                else {
                    res.status(404).json({ error: 'Table not found or not updated' });
                }
            }
            catch (error) {
                console.error('Update table status error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new TableController();
