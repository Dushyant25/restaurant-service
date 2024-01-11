"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_1 = __importDefault(require("../controllers/restaurant"));
const router = express_1.default.Router();
// router.use(authenticateUser);
// create restaurants
router.post('/create', restaurant_1.default.createRestaurant);
// router.post('/create', authorizeRole(['manager']), restaurantController.createRestaurant);
exports.default = router;
