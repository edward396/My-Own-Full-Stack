/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 
*/

import { Router} from 'express';
import { getUsersRoleQuerySchema } from '../types/general.type';
import { getShippersController } from '../controllers/shipper.controller';
import { validationMiddleware } from '../middleware/validation.middleware';

const ShipperRouter = Router();

//for query get multiple users
ShipperRouter.get('/', validationMiddleware(getUsersRoleQuerySchema, 'query'), getShippersController); //return list of Full info customer[]

export default ShipperRouter