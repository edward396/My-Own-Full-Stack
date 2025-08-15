"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db/db");
const json_mes_1 = require("../utils/json_mes");
const requireAuth_1 = require("../middleware/requireAuth");
const user_service_1 = require("../service/user.service");
const validation_1 = require("../utils/validation");
const auth_service_1 = require("../service/auth.service");
const authRouter = (0, express_1.Router)();
const allowedFieldForRegister = ['id', 'email', 'password', 'username', 'profile_picture', 'role', 'name', 'address', 'hub_id', 'business_name', 'business_address'];
authRouter.post('/login', async (req, res) => {
    try {
        //check if the body is valid or not
        const Invalid = (0, validation_1.hasUnknownFields)(allowedFieldForRegister, req.body);
        if (Invalid) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 400, "Unknown fields detect in request");
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Email and password are required');
        }
        const session = await (0, db_1.signInUser)(email, password);
        if (!session) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 401, 'Invalid credentials');
        }
        //add cookies :>
        res.cookie('access_token', session.access_token, {
            httpOnly: true,
            secure: process.env.PRODUCTION_SITE === 'true', // http or https
            path: '/',
        });
        //could be removed since not use, but might use later
        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: process.env.PRODUCTION_SITE === 'true', // http or https
            path: '/',
        });
        //get user through id
        const user = await user_service_1.UserService.getUserById(session.user.id);
        if (user === null) { //this mean the user is created in authen but not in the db table (!critical if happens)
            return (0, json_mes_1.ErrorJsonResponse)(res, 404, "Unknown user");
        }
        // Return success with tokens
        (0, json_mes_1.SuccessJsonResponse)(res, 200, {
            data: {
                // access_token: session.access_token,
                // refresh_token: session.refresh_token,
                user: user
            }
        });
    }
    catch (error) {
        (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
    }
});
authRouter.post('/register/customer', async (req, res) => {
    try {
        //check valid field input
        const Invalid = (0, validation_1.hasUnknownFields)(allowedFieldForRegister, req.body);
        if (Invalid) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 400, "Unknown fields detect in request");
        }
        const result = await auth_service_1.AuthService.registerCustomer(req, res);
        return result;
    }
    catch (error) {
        (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
    }
});
authRouter.post('/register/shipper', async (req, res) => {
    try {
        const Invalid = (0, validation_1.hasUnknownFields)(allowedFieldForRegister, req.body);
        if (Invalid) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 400, "Unknown fields detect in request");
        }
        const result = await auth_service_1.AuthService.registerShipper(req, res);
        return result;
    }
    catch (error) {
        (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
    }
});
authRouter.post('/register/vendor', async (req, res) => {
    try {
        const Invalid = (0, validation_1.hasUnknownFields)(allowedFieldForRegister, req.body);
        if (Invalid) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 400, "Unknown fields detect in request");
        }
        const result = await auth_service_1.AuthService.registerVendor(req, res);
        return result;
    }
    catch (error) {
        (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
    }
});
//change password for authen, for db, would go after user router instead, not move to service yet, have to do later
authRouter.post('/changepassword', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Email and password are required');
        }
        const session = await (0, db_1.changePassword)(password);
        if (!session) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Error can not change password.');
        }
        (0, json_mes_1.SuccessJsonResponse)(res, 200, 'Successfully change password');
    }
    catch (error) {
        (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
    }
});
exports.default = authRouter;
