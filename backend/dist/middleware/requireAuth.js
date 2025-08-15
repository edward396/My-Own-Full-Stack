"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const json_mes_1 = require("../utils/json_mes");
const db_1 = require("../db/db");
async function requireAuth(req, res, next) {
    const token = req.cookies.access_token;
    console.log('Access token:', token);
    if (!token) {
        return (0, json_mes_1.ErrorJsonResponse)(res, 401, 'No token provided');
    }
    // Verify token with Supabase
    const { data, error } = await db_1.supabase.auth.getUser(token);
    if (error || !data.user) {
        return (0, json_mes_1.ErrorJsonResponse)(res, 401, 'Unauthorized: Invalid token');
    }
    // Attach user info to request if needed
    ;
    req.user = data.user;
    next();
}
