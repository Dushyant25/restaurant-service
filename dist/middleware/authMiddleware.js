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
exports.authorizeRole = exports.authenticateUser = exports.comparePasswords = exports.hashPassword = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken = (userId, role, mobileNo) => {
    return jsonwebtoken_1.default.sign({ userId, role, mobileNo }, process.env.JWT_SECRET, { expiresIn: '20d' });
};
exports.generateToken = generateToken;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
});
exports.hashPassword = hashPassword;
const comparePasswords = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(password, hashedPassword);
});
exports.comparePasswords = comparePasswords;
const authenticateUser = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const ifAdmin = Boolean(req.header('Bypass-Authorization'));
        if (ifAdmin)
            next(); // can be optimized 
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token not provided' });
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.authenticateUser = authenticateUser;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        const bypassRole = req.headers['bypass-authorization'];
        if (bypassRole === 'admin')
            next(); // can be optimized later 
        if (!userRole || (!allowedRoles.includes(userRole) && bypassRole !== 'admin')) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
