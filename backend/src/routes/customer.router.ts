/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { Router} from 'express';
import {} from '../service/customer.service'
import { getUsersRoleQuerySchema } from '../types/general.type';
import { validationMiddleware } from '../middleware/validation.middleware';
import { getCustomersController } from '../controllers/customer.controller';

const CustomerRouter = Router();
//for query get multiple users
CustomerRouter.get('/', validationMiddleware(getUsersRoleQuerySchema, 'query'), getCustomersController); //return list of Full info customer[]

export default CustomerRouter