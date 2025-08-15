import * as z from "zod";
import { Request, Response } from "express";
import { signInUser } from "../../db/db";
import { ErrorJsonResponse, SuccessJsonResponse } from "../../utils/json_mes";
import { hasUnknownFields } from "../../utils/validation";
import { UserService } from "../../service/user.service";

const allowedFieldForRegister = ['id', 'email', 'password', 'username', 'profile_picture', 'role', 'name', 'address', 'hub_id', 'business_name', 'business_address'];

export const loginBodySchema = z.object({
    email: z.string(),
    password: z.string()
}).strict();

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const session = await signInUser(email, password)

        if (!session) {
            return ErrorJsonResponse(res, 401, 'Invalid credentials')
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

        //get user through id
        const user = await UserService.getUserById(session.user.id)

        if (user === null) {//this mean the user is created in authen but not in the db table (!critical if happens)
            return ErrorJsonResponse(res, 404, "Unknown user")
        }

        // Return success with tokens
        SuccessJsonResponse(res, 200, {
            data: {
                // access_token: session.access_token,
                // refresh_token: session.refresh_token,
                user: user
            }
        })

    } catch (error) {
        ErrorJsonResponse(res, 500, 'Internal server error')
    }
}