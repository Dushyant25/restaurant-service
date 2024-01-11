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
    getAllTables(branchId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllTablesQuery = 'SELECT * FROM tables WHERE branch_id = $1';
                const result = yield db_1.default.query(getAllTablesQuery, [branchId]);
                return result.rows;
            }
            catch (error) {
                console.error('Error fetching all tables:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    updateTableStatus(branchId, tableNo, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateTableStatusQuery = 'UPDATE tables SET status = $1 WHERE branch_id = $2 AND table_number = $3 RETURNING *';
                const result = yield db_1.default.query(updateTableStatusQuery, [status, branchId, tableNo]);
                if (result.rows.length === 0) {
                    return null; // Table not found or not updated
                }
                return result.rows[0];
            }
            catch (error) {
                console.error('Error updating table status:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.default = new TableService();
