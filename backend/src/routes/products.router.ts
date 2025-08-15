/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { Router, Request, Response } from 'express';
import { Product, ProductService } from '../service/products.service';
import { ErrorJsonResponse, SuccessJsonResponse } from '../utils/json_mes';
import { getProductByIdController } from '../controllers/products/getProductById.controller';
const ProductRouter = Router();

ProductRouter.get('/', async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    try {
        if (queries.length === 0) {
            const users: Product[] | null = await ProductService.getAllProducts()
            if(!users){
                return SuccessJsonResponse(res, 200, 'No users but still success call')
            }
            return SuccessJsonResponse(res, 200, users)
        }
        if (queries.length === 1 && 'id' in req.query) { // this is same as ?id=number
            
            const user : Product | null = await ProductService.getProductById(String(req.query.id))
                
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

ProductRouter.get('/{productId}', getProductByIdController);

export default ProductRouter