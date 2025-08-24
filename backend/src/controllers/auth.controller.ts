/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import * as z from "zod";
import { signInUser } from "../db/db";
import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { AuthService } from "../service/auth.service";
import { ErrorJsonResponse, SuccessJsonResponse } from "../utils/json_mes";
 
//xin frontend nhá =))
const usernameRegex = /^[A-Za-z0-9]{8,15}$/;
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
const usernameSchema = z.string().regex(usernameRegex, "Username must be 8-15 letters/digits").trim();
const passwordSchema = z.string().regex(passwordRegex,"Password 8-20, includes upper, lower, digit, special !@#$%^&*").trim();


export const loginBodySchema = z.object({
    email: z.email("Invalid email format").trim(),
    password: passwordSchema
}).strict(); 

export const registerCustomerBodySchema = z.object({
    email: z.email("Invalid email format").trim(),
    password: passwordSchema,
    username: usernameSchema,
    profile_picture: z.string().trim(),
    // role: z.literal("customer"),
    address: z.string().trim(),
    name: z.string().trim()
}).strict();

export const registerShipperBodySchema = z.object({
    email: z.email("Invalid email format").trim(),
    password: passwordSchema,
    username: usernameSchema,
    profile_picture: z.string().trim(),
    // role: z.literal("shipper"),
    hub_id: z.string().trim()
}).strict();

export const registerVendorBodySchema = z.object({
    email: z.email("Invalid email format").trim(),
    password: passwordSchema,
    username: usernameSchema,
    profile_picture: z.string().trim(),
    // role: z.literal("vendor"),
    business_address: z.string().trim(),
    business_name: z.string().trim()
}).strict();

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const session = await signInUser(email, password)

        if (!session) {
            return ErrorJsonResponse(res, 401, 'Invalid credentials')
        }

        //get user through id
        const user = await UserService.getUserById(session.user.id)

        if (!user) {//this mean the user is created in authen but not in the db table (!critical if happens)
            return ErrorJsonResponse(res, 404, "WARNING! Unknown user in db but found in authentication!")
        }

        //add cookies :>
        res.cookie('access_token', session.access_token, {
            httpOnly: true,
            secure: process.env.PRODUCTION_SITE === 'true', // http or https
            path: '/',
        })

        //could be removed since not use, but might use later
        res.cookie('refresh_token', session.refresh_token, {
            httpOnly: true,
            secure: process.env.PRODUCTION_SITE === 'true', // http or https
            path: '/',
        })

        // Return success with tokens
        SuccessJsonResponse(res, 200, {
            data: {
                user: user
            }
        })

    } catch (error) {
        ErrorJsonResponse(res, 500, 'Internal server error')
    }
}

export const registerCustomerController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await AuthService.registerCustomer(req.body);

        if (!result.success) {
            return ErrorJsonResponse(res, 400, result.error!);
        }
        //add cookies :>
        addCookie(res, result.data!);
        
        return SuccessJsonResponse(res, 200, {
            data: {
                user: result.data!.user
            }
        });
        
    } catch (error) {
        return ErrorJsonResponse(res, 500, 'Internal server error');
    }
};

export const registerShipperController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await AuthService.registerShipper(req.body);
        
        if (!result.success) {
            return ErrorJsonResponse(res, 400, result.error!);
        }
        
        //add cookies :>
        addCookie(res, result.data!);
        
        return SuccessJsonResponse(res, 200, {
            data: {
                access_token: result.data!.access_token,
                refresh_token: result.data!.refresh_token,
                user: result.data!.user
            }
        });
        
    } catch (error) {
        return ErrorJsonResponse(res, 500, 'Internal server error');
    }
};

export const registerVendorController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const result = await AuthService.registerVendor(req.body);

        if (!result.success) {
            return ErrorJsonResponse(res, 400, result.error!);
        }
        
        addCookie(res, result.data!);
        
        return SuccessJsonResponse(res, 200, {
            data: {
                access_token: result.data!.access_token,
                refresh_token: result.data!.refresh_token,
                user: result.data!.user
            }
        });
        
    } catch (error) {
        return ErrorJsonResponse(res, 500, 'Internal server error');
    }
};

//for adding of all cookies when signUp or signIn
function addCookie(res : Response, session : any){
    res.cookie('access_token', session.access_token, {
            httpOnly: true,
            secure: process.env.PRODUCTION_SITE === 'true', // http or https
            path: '/',
    })
    
    res.cookie('refresh_token', session.refresh_token, {
        httpOnly: true,
        secure: process.env.PRODUCTION_SITE === 'true', // http or https
        path: '/',
    })
}