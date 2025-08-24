/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import {z} from "zod"

export type Pagination = {
    page: number
    size: number
}

export type UpdateServiceResult = {
    success : boolean,
    error? : string
}

export const getUsersRoleQuerySchema = z.object({
    page: z.string().default("-1").transform((val) => parseInt(val, 10)),
    size: z.string().default("-1").transform((val) => parseInt(val, 10)),
}).strict();

export type GetUsersRoleQueryType = z.output<typeof getUsersRoleQuerySchema>;