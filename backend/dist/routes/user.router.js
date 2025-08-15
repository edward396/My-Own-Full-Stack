"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const json_mes_1 = require("../utils/json_mes");
const user_service_1 = require("../service/user.service");
const UserRouter = (0, express_1.Router)();
//getting all users from db
UserRouter.get('/', async (req, res) => {
    const queries = Object.keys(req.query);
    try {
        if (queries.length === 0) {
            const users = await user_service_1.UserService.getAllUsers();
            if (!users) {
                return (0, json_mes_1.SuccessJsonResponse)(res, 200, 'No users but still success call');
            }
            return (0, json_mes_1.SuccessJsonResponse)(res, 200, users);
        }
        if (queries.length === 1 && 'id' in req.query) { // this is same as ?id=number
            const user = await user_service_1.UserService.getUserById(String(req.query.id));
            if (!user) { // return data is null
                return (0, json_mes_1.ErrorJsonResponse)(res, 404, 'user not found');
            }
            return res.json(user);
        }
        return (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Invalid query parameters');
    }
    catch (error) {
        return (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Failed to fetch user(s)');
    }
});
exports.default = UserRouter;
