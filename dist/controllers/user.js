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
const user_1 = __importDefault(require("../service/user"));
class UserController {
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const user = yield user_1.default.getUserById(userId);
                res.json(user);
            }
            catch (error) {
                console.error('Error getting user by ID:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mobileNo, password, userName, role, branch_id } = req.body;
                const user = yield user_1.default.createUser({ mobileNo, password, userName, role, branch_id });
                res.json(user);
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mobileNo, password } = req.body;
                const user = yield user_1.default.loginUser(mobileNo, password);
                res.json(user);
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new UserController();
