/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { Router, Request, Response } from 'express';
import { ErrorJsonResponse, SuccessJsonResponse } from '../utils/json_mes';
import { UserService, User } from '../service/user.service'

const UserRouter = Router();

//getting all users from db
UserRouter.get('/', async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    try {
        if (queries.length === 0) {
            const users: User[] | null = await UserService.getAllUsers()
            if(!users){
                return SuccessJsonResponse(res, 200, 'No users but still success call')
            }
            return SuccessJsonResponse(res, 200, users)
        }
        if (queries.length === 1 && 'id' in req.query) { // this is same as ?id=number
            
            const user : User | null = await UserService.getUserById(String(req.query.id))
                
            if (!user) { // return data is null
                return ErrorJsonResponse(res, 404, 'user not found')
            }
            return res.json(user)
        }
        return ErrorJsonResponse(res, 500, 'Invalid query parameters')
    } catch (error) {
        return ErrorJsonResponse(res, 500, 'Failed to fetch user(s)')
    }
})

export default UserRouter