/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen Vo Truong Toan
# ID: s3979056 */

import { Router} from 'express';
import { validationMiddleware } from '../middleware/validation.middleware';
import { getAllDistributionHubsController, getAllHubsQuerrySchema } from '../controllers/getDistributionHubsController';

const DistributionHubRouter = Router();

DistributionHubRouter.get("/", validationMiddleware(getAllHubsQuerrySchema, 'query'), getAllDistributionHubsController);

export default DistributionHubRouter;