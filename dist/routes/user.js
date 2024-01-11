"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const router = express_1.default.Router();
// get userDetails 
router.get('/:userId', user_1.default.getUserById);
// register/create new user
router.post('/create', user_1.default.createUser);
// login user
router.post('/login', user_1.default.loginUser);
exports.default = router;
