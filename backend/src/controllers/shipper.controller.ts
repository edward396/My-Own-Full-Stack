/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */
import { Request, Response } from "express"
import { ShipperService } from "../service/shipper.service";
import { GetUsersRoleQueryType } from "../types/general.type";
import { ErrorJsonResponse, SuccessJsonResponse } from "../utils/json_mes"

export const getShippersController = async (req: Request, res: Response) => {
    try {
        const { page, size } = (req as unknown as Record<string, unknown> & {
            validatedquery: GetUsersRoleQueryType
        }).validatedquery;

        const users = await ShipperService.getShippers({ page, size });

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