"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../db/db");
const db_2 = require("../db/db");
const json_mes_1 = require("../utils/json_mes");
const user_service_1 = require("./user.service");
const customer_service_1 = require("./customer.service");
const shipper_service_1 = require("./shipper.service");
const vendor_service_1 = require("./vendor.service");
//đang bị duplicate code, cần refactor later
exports.AuthService = {
    async registerCustomer(req, res) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Email and password are required');
            }
            //try signup
            const session = await (0, db_2.signUpUser)(email, password);
            if (!session) {
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Error creating user, or user already exists.');
            }
            //how to check for all field need before create the temp_user to add?
            const temp_user = {
                id: session.user.id,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                profile_picture: req.body.profile_picture,
                role: "customer"
            };
            //create in user table
            const user = await user_service_1.UserService.createUser(temp_user);
            let user_data = null; // init
            if (!user) {
                //remove user in the authen if cant create the user in the db
                await (0, db_1.deleteAuthenUser)(session.user.id);
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Error creating user in db users');
            }
            const temp_customer = {
                id: session.user.id,
                address: req.body.address,
                name: req.body.name,
            };
            //create in customer table
            const customer = await customer_service_1.CustomerService.createCustomer(temp_customer);
            if (!customer) {
                //remove created user in authen and in user table
                await (0, db_1.deleteAuthenUser)(session.user.id);
                await user_service_1.UserService.deleteUser(session.user.id);
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, "Fail to create customer at db customer");
            }
            user_data = { ...user, ...customer }; //get all data of that user
            addCookie(res, session);
            return (0, json_mes_1.SuccessJsonResponse)(res, 200, {
                data: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: user_data
                }
            });
        }
        catch (error) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
        }
    },
    async registerShipper(req, res) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Email and password are required');
            }
            //try signup
            const session = await (0, db_2.signUpUser)(email, password);
            if (!session) {
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Error creating user, or user already exists.');
            }
            //how to check for all field need before create the temp_user to add?
            const temp_user = {
                id: session.user.id,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                profile_picture: req.body.profile_picture,
                role: "shipper"
            };
            //create in user table
            const user = await user_service_1.UserService.createUser(temp_user);
            let user_data = null; // init
            if (!user) {
                await (0, db_1.deleteAuthenUser)(session.user.id);
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Error creating user in db users');
            }
            const temp_shipper = {
                id: session.user.id,
                hub_id: req.body.hub_id,
            };
            //create in customer table
            const shipper = await shipper_service_1.ShipperService.createShipper(temp_shipper);
            if (!shipper) {
                await (0, db_1.deleteAuthenUser)(session.user.id);
                await user_service_1.UserService.deleteUser(session.user.id);
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, "Fail to create shipper at db shipper");
            }
            user_data = { ...user, ...shipper }; //get all data of that user
            addCookie(res, session);
            return (0, json_mes_1.SuccessJsonResponse)(res, 200, {
                data: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: user_data
                }
            });
        }
        catch (error) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
        }
    },
    async registerVendor(req, res) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Email and password are required');
            }
            //try signup
            const session = await (0, db_2.signUpUser)(email, password);
            if (!session) {
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Error creating user, or user already exists.');
            }
            //how to check for all field need before create the temp_user to add?
            const temp_user = {
                id: session.user.id,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username,
                profile_picture: req.body.profile_picture,
                role: "vendor"
            };
            //create in user table
            const user = await user_service_1.UserService.createUser(temp_user);
            let user_data = null; // init
            if (!user) {
                await (0, db_1.deleteAuthenUser)(session.user.id);
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, 'Error creating user in db users');
            }
            const temp_vendor = {
                id: session.user.id,
                business_name: req.body.business_name,
                business_address: req.body.business_address
            };
            //create in customer table
            const vendor = await vendor_service_1.VendorService.createVendor(temp_vendor);
            if (!vendor) {
                await (0, db_1.deleteAuthenUser)(session.user.id);
                await user_service_1.UserService.deleteUser(session.user.id);
                return (0, json_mes_1.ErrorJsonResponse)(res, 400, "Fail to create vendor at db vendor");
            }
            user_data = { ...user, ...vendor }; //get all data of that user
            //add cookie
            addCookie(res, session);
            return (0, json_mes_1.SuccessJsonResponse)(res, 200, {
                data: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    user: user_data
                }
            });
        }
        catch (error) {
            return (0, json_mes_1.ErrorJsonResponse)(res, 500, 'Internal server error');
        }
    }
};
//for adding of all cookies when signUp or signIn
function addCookie(res, session) {
    res.cookie('access_token', session.access_token, {
        httpOnly: true,
        secure: process.env.PRODUCTION_SITE === 'true', // http or https
        path: '/',
    });
    res.cookie('refresh_token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.PRODUCTION_SITE === 'true', // http or https
        path: '/',
    });
}
