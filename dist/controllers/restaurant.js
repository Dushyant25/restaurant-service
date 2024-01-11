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
const restaurant_1 = __importDefault(require("../service/restaurant"));
class RestaurantController {
    // create restaurent 
    createRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, location } = req.body;
                const newRestaurant = yield restaurant_1.default.createRestaurant(name, location);
                let numberOfTables = 10; // by default 10 tables will be created 
                const createdTables = yield restaurant_1.default.createTablesForRestaurant(newRestaurant.branch_id, numberOfTables);
                res.json({
                    restaurant: newRestaurant,
                    tables: createdTables,
                });
            }
            catch (error) {
                console.error('Create restaurant with tables error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    // add tables
    addTables(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { branchId, numberOfTables } = req.body;
                const createdTables = yield restaurant_1.default.createTablesForRestaurant(branchId, numberOfTables);
                res.json(createdTables);
            }
            catch (error) {
                console.error('Create restaurant with tables error:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new RestaurantController();
