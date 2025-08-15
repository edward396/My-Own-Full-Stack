/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { type Request, type Response, type NextFunction } from 'express'
import { ErrorJsonResponse } from "../utils/json_mes"
import { supabase } from "../db/db"

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token
    console.log('Access token:', token)
    if (!token) {
        return ErrorJsonResponse(res, 401, 'No token provided')
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) {
        console.log('error: ', error);
        return ErrorJsonResponse(res, 401, 'Unauthorized: Invalid token')
    }

    // Attach user info to request if needed
    ; (req as any).user = data.user
    next()
}