/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen The Anh
# ID: s3975844*/

import { Router} from 'express';
import { validationMiddleware } from '../middleware/validation.middleware';
import { getCartQuerrySchema, 
         getCartController, 
         deleteByIdParamsSchema, 
         deleteCartItemByIdController, 
         checkoutController} 
         from '../controllers/shoppingCartController';


const ShoppingCartRouter = Router();

//view the shopping cart of the customer
ShoppingCartRouter.get("/", validationMiddleware(getCartQuerrySchema, 'query'), getCartController);

//delete the product in shoppping cart by id
ShoppingCartRouter.delete("/deleteItem/:id", validationMiddleware(deleteByIdParamsSchema, 'params'), deleteCartItemByIdController);

//checkout the shopping cart (all items in the cart will be ordered)
ShoppingCartRouter.post("/checkout", checkoutController)
export default ShoppingCartRouter;