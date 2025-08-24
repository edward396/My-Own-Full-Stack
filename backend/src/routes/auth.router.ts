/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { Router } from 'express';
import { validationMiddleware } from '../middleware/validation.middleware';
import { loginBodySchema, 
        loginController, 
        registerCustomerBodySchema, 
        registerCustomerController, 
        registerShipperBodySchema, 
        registerShipperController, 
        registerVendorBodySchema, 
        registerVendorController } 
        from '../controllers/auth.controller';  

const authRouter = Router();

authRouter.post('/login', validationMiddleware(loginBodySchema, 'body'), loginController);
//NOTE on work: move controller and modify service to correct layer usage
authRouter.post('/register/customer', validationMiddleware(registerCustomerBodySchema, 'body'), registerCustomerController);
authRouter.post('/register/shipper', validationMiddleware(registerShipperBodySchema, 'body'), registerShipperController);
authRouter.post('/register/vendor', validationMiddleware(registerVendorBodySchema, 'body'), registerVendorController);

export default authRouter;