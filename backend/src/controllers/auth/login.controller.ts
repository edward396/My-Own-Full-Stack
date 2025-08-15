import { Request, Response } from "express";
import { signInUser } from "../../db/db";
import { ErrorJsonResponse } from "../../utils/json_mes";
import { hasUnknownFields } from "../../utils/validation";

const allowedFieldForRegister = ['id', 'email', 'password', 'username', 'profile_picture', 'role', 'name', 'address', 'hub_id', 'business_name', 'business_address'];

export const loginController = async (req: Request, res: Response) => {
    try {
        //check if the body is valid or not
        const Invalid = hasUnknownFields(allowedFieldForRegister, req.body);
        if (Invalid) {
            return ErrorJsonResponse(res, 400, "Unknown fields detect in request")
        }

        const { email, password } = req.body

        if (!email || !password) {
            return ErrorJsonResponse(res, 400, 'Email and password are required')
        }

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