import * as z from "zod";
import { NextFunction, Request, Response } from "express";
import { ErrorJsonResponse } from "../utils/json_mes";

export const validationMiddleware = (schema: z.Schema, validationPart: 'body' | 'params' | 'query') => (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = schema.parse(req[validationPart]); // req['body'] <=> req.body
        req[validationPart] = validatedData;
        next();
    } catch (err) {
        ErrorJsonResponse(res, 400, (err as Error).message);
    }
}