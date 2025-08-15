"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = 5000;
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
//for cookies :D
app.use((0, cookie_parser_1.default)());
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Mount the main API router under the '/api' base path.
app.use('/api', router_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
