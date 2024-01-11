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
const authMiddleware_1 = require("../middleware/authMiddleware");
const db_1 = __importDefault(require("../db"));
class UserService {
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM users WHERE user_id = $1 AND is_active = true';
                const values = [userId];
                const result = yield db_1.default.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                console.error('Error retrieving user:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { userName, branch_id, mobileNo, password, role } = data;
                // Check if the mobile number is already taken
                const mobileNoExists = yield db_1.default.query('SELECT * FROM users WHERE mobile_no = $1', [mobileNo]);
                if (mobileNoExists.rows.length > 0) {
                    return { status: 400, error: 'Mobile number is already taken' };
                }
                // Hash the password before saving to the database
                const hashedPassword = yield (0, authMiddleware_1.hashPassword)(password);
                // Save the user to the database
                const result = yield db_1.default.query('INSERT INTO users (username, mobile_no, password, role, branch_id, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [userName, mobileNo, hashedPassword, role, branch_id, true] //is_active by default true 
                );
                const user = result.rows[0];
                const token = (0, authMiddleware_1.generateToken)(user.user_id.toString(), user.role, user.mobile_no);
                return { token };
            }
            catch (error) {
                console.error('Registration error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
    loginUser(mobileNo, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query('SELECT * FROM users WHERE mobile_no = $1', [mobileNo]);
                if (result.rows.length === 0) {
                    return { status: 401, error: 'Invalid credentials' };
                }
                const user = result.rows[0];
                const passwordMatch = yield (0, authMiddleware_1.comparePasswords)(password, user.password);
                if (!passwordMatch) {
                    return { status: 401, error: 'Invalid credentials' };
                }
                const token = (0, authMiddleware_1.generateToken)(user.user_id.toString(), user.role, user.mobile_no);
                return { token };
            }
            catch (error) {
                console.error('Login error:', error);
                throw new Error('Internal Server Error');
            }
        });
    }
}
exports.default = new UserService();
