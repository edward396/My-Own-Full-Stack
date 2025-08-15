"use strict";
/* RMIT University Vietnam
# Course: COSC2769 - Full Stack Development
# Semester: 2025B
# Assessment: Assignment 02
# Author: Truong Ba An
# ID: s3999568 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorJsonResponse = ErrorJsonResponse;
exports.SuccessJsonResponse = SuccessJsonResponse;
function ErrorJsonResponse(res, statusCode, errorMessage) {
    return res.status(statusCode).json({
        success: false,
        message: errorMessage
    });
}
function SuccessJsonResponse(res, statusCode, successMessage) {
    return res.status(statusCode).json({
        success: true,
        message: successMessage
    });
}
