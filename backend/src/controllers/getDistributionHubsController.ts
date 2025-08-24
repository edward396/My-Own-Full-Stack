/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen Vo Truong Toan
# ID: s3979056 */

import * as z from "zod";
import { Request, Response } from "express";
import { ErrorJsonResponse, SuccessJsonResponse } from "../utils/json_mes";
import { DistributionHubService } from "../service/distribution_hubs.service";

export const getAllHubsQuerrySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(30).default(10),
}).strict();

type GetProductsQuerryType = z.output<typeof getAllHubsQuerrySchema>;

export const getAllDistributionHubsController = async (req: Request, res: Response) => {
    try {
        const { page, size } = (req as unknown as Record<string, unknown> & { validatedquery: GetProductsQuerryType }).validatedquery;

        const hubs = await DistributionHubService.getAllDistributionHubs({ page, size });
        if (hubs === null) {
            return ErrorJsonResponse(res, 500, "Failed to fetch distribution hubs");
        }

        if (hubs === null) {
            return ErrorJsonResponse(res, 500, "Failed to fetch products");
        }

        return SuccessJsonResponse(res, 200, {
            data: { hubs, count: hubs.length },
        });
    } catch (err: any) {
        if (err?.issues?.length) {
            return ErrorJsonResponse(res, 400, err.issues[0].message || "Invalid query parameters");
        }
        console.error(err);
        return ErrorJsonResponse(res, 500, "Unexpected error while fetching distribution hubs");
    }
};