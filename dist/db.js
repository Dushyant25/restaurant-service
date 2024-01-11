"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.PORT || '5432'),
});
exports.default = pool;
