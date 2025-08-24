/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { Router } from 'express';
import { getUsersRoleQuerySchema } from '../types/general.type';
import { getVendorsController } from '../controllers/vendor.controller';
import { validationMiddleware } from '../middleware/validation.middleware';

const VendorRouter = Router();

//for query get multiple users
VendorRouter.get('/', validationMiddleware(getUsersRoleQuerySchema, 'query'), getVendorsController); //return list of Full info customer[]

export default VendorRouter

