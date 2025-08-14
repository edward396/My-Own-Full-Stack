/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { type Response } from 'express'; // Import the Response type from Express
import type { Json } from '../db/db';

export function ErrorJsonResponse(res: Response, statusCode: number, errorMessage: Json): Response {
    return res.status(statusCode).json({
        success: false,
        message: errorMessage
    });
}

export function SuccessJsonResponse(res: Response, statusCode: number, successMessage: Json): Response {
    return res.status(statusCode).json({ 
        success : true,
        message : successMessage});
}