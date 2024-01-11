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
exports.register = exports.login = void 0;
const authMiddleware_1 = require("../middleware/authMiddleware");
const db_1 = __importDefault(require("../db"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNo, password } = req.body;
    try {
        const result = yield db_1.default.query('SELECT * FROM users WHERE mobile_no = $1', [mobileNo]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const passwordMatch = yield (0, authMiddleware_1.comparePasswords)(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = (0, authMiddleware_1.generateToken)(user.user_id.toString(), user.role, user.mobile_no);
        res.json({ token });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNo, password, userName, role, restaurantId } = req.body;
    try {
        // Check if the mobile number is already taken
        const mobileNoExists = yield db_1.default.query('SELECT * FROM users WHERE mobile_no = $1', [mobileNo]);
        if (mobileNoExists.rows.length > 0) {
            return res.status(400).json({ error: 'Mobile number is already taken' });
        }
        // Hash the password before saving to the database
        const hashedPassword = yield (0, authMiddleware_1.hashPassword)(password);
        // Save the user to the database
        const result = yield db_1.default.query('INSERT INTO users (username, mobile_no, password, role, restaurant_id, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [userName, mobileNo, hashedPassword, role, restaurantId, true] //is_active by default true 
        );
        const user = result.rows[0];
        const token = (0, authMiddleware_1.generateToken)(user.user_id.toString(), user.role, user.mobile_no);
        res.json({ token });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.register = register;
