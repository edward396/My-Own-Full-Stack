/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */
import { z } from "zod"
import { Request, Response } from "express"
import { UserService } from "../service/user.service"
import { ErrorJsonResponse, SuccessJsonResponse } from "../utils/json_mes"

export const getUsersQuerySchema = z.object({
    page: z.string().default("-1").transform((val) => parseInt(val, 10)),
    size: z.string().default("-1").transform((val) => parseInt(val, 10)),
    role: z.enum(["customer", "shipper", "vendor", "all"]).optional().default("all"),
}).strict();

type GetUsersQueryType = z.output<typeof getUsersQuerySchema>;

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const { page, size, role } = (req as unknown as Record<string, unknown> & {
            validatedquery: GetUsersQueryType
        }).validatedquery;

        const users = await UserService.getUsers({ page, size }, { role });

        if (users === null) {
            return ErrorJsonResponse(res, 500, "Failed to fetch users");
        }

        return SuccessJsonResponse(res, 200, {
            data: { users, count: users.length },
        });
    } catch (err: any) {
        if (err?.issues) {
            return ErrorJsonResponse(res, 400, err.issues[0].message);
        }
        return ErrorJsonResponse(res, 500, "Unexpected error while fetching users");
    }
};

//use req.body
export const getUserByIdParamsSchema = z.object({
    id: z.string(),
}).strict()

type GetUserByIdParamsType = z.output<typeof getUserByIdParamsSchema>

export const getUserByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = (req as unknown as Record<string, unknown> & {
            validatedparams: GetUserByIdParamsType
        }).validatedparams

        const user = await UserService.getUserById(id, true)

        if (!user) {
            return ErrorJsonResponse(res, 404, "User not found")
        }
        return SuccessJsonResponse(res, 200, { data: user })
    } catch (err: any) {
        if (err?.issues) {
            return ErrorJsonResponse(res, 400, err.issues[0].message)
        }
        return ErrorJsonResponse(res, 500, "Unexpected error while fetching user")
    }
}

//same like get user by id, but might be other field added in get user by id, dont group them!
export const deleteUserByIdParamsSchema = z.object({
    id: z.string(),
}).strict()

type DeleteUserByIdParamsType = z.output<typeof deleteUserByIdParamsSchema>

//use req.param
export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const { id } = (req as unknown as Record<string, unknown> & {
            validatedparams: DeleteUserByIdParamsType
        }).validatedparams;

        const deleted = await UserService.deleteUser(id)
        if (!deleted) {
            return ErrorJsonResponse(res, 500, "Failed to delete user")
        }
        return SuccessJsonResponse(res, 200, { message: "User deleted successfully" })
    } catch (err: any) {
        if (err?.issues) {
            return ErrorJsonResponse(res, 400, err.issues[0].message)
        }
        return ErrorJsonResponse(res, 500, "Unexpected error while deleting user")
    }
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
const passwordSchema = z.string().regex(passwordRegex, "Password 8-20, includes upper, lower, digit, special !@#$%^&*").trim();

export const updateUserByIdParamsSchema = z.object({
    password: passwordSchema.optional(),
    newPassword: passwordSchema.optional(),
    profile_picture: z.string().optional(),
}).strict()

export const updateUserByIdController = async (req: Request, res: Response) => {
    try {
        const { password, newPassword, profile_picture } = req.body;
        // Ensure user can only update their own account
        const id = req.user_id
        
        // Password change validation
        if ((password && !newPassword) || (!password && newPassword)) {
            return ErrorJsonResponse(res, 400, "Can not change password without providing both old and new password");
        }

        // Call service layer
        const result = await UserService.updateUser({id,password,newPassword,profile_picture});

        if (!result) {
            return ErrorJsonResponse(res, 400, "Failed to update user");
        }

        return SuccessJsonResponse(res, 200, `Successfully update user ${req.user_id}`);
    } catch (err: any) {
        console.error(err);
        return ErrorJsonResponse(res, 500, "Internal server error");
    }
}

export const uploadProfilePictureController = async (req:Request, res: Response) => {
    try {
        if (!req.file) {
            return ErrorJsonResponse(res, 400, "No file uploaded");
        }

        const result = await UserService.uploadImage(req.user_id, req.file);

        if (!result.success) {
            return ErrorJsonResponse(res, 500, `${result.error}`);
        }

        return SuccessJsonResponse(res, 200, `${result.url}`)
    } catch (err) {
        console.error("Unexpected error in uploadImageController:", err);
        return ErrorJsonResponse(res, 500, "Unexpected error uploading image");
    }
}