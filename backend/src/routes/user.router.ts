/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { Router} from 'express';
import multer from "multer";
import { validationMiddleware } from '../middleware/validation.middleware';
import { getUsersQuerySchema, 
         getUsersController, 
         getUserByIdController, 
         deleteUserController, 
         deleteUserByIdParamsSchema, 
         updateUserByIdParamsSchema, 
         updateUserByIdController, 
         uploadProfilePictureController } 
         from '../controllers/user.controller';

const upload = multer(); // memory storage
const UserRouter = Router();
//for query get multiple users
UserRouter.get('/', validationMiddleware(getUsersQuerySchema, 'query'), getUsersController); //return list of User[]
//for single user
UserRouter.get('/:id', validationMiddleware(getUsersQuerySchema, 'params'), getUserByIdController);//return User
//delete user
UserRouter.delete('/:id', validationMiddleware(deleteUserByIdParamsSchema, 'params'), deleteUserController);
//update password
UserRouter.patch('/update', validationMiddleware(updateUserByIdParamsSchema, 'body'), updateUserByIdController);
//upload image 
UserRouter.post("/image", upload.single("file"), uploadProfilePictureController);
export default UserRouter