/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Truong Ba An
# ID: s3999568 */

import { Router, Request, Response } from 'express';
import { Product, ProductService } from '../service/products.service';
import { ErrorJsonResponse, SuccessJsonResponse } from '../utils/json_mes';
import { getProductByIdController, getProductByIdParamsSchema } from '../controllers/products/getProductById.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createProductBodySchema } from '../controllers/products/createProduct.controller';
import { deleteProductParamsSchema } from '../controllers/products/deleteProduct.controller';

const ProductRouter = Router();

ProductRouter.get('/', async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    try {
        if (queries.length === 1 && 'category' in req.query) {
            const category = String(req.query.category);
            const products = await ProductService.getProductsByCategory(category);
            return SuccessJsonResponse(res, 200, products ?? []);
        }
        if (queries.length === 0) {
            const users: Product[] | null = await ProductService.getAllProducts()
            if (!users) {
                return SuccessJsonResponse(res, 200, 'No users but still success call')
            }
            return SuccessJsonResponse(res, 200, users)
        }
        if (queries.length === 1 && 'id' in req.query) { // this is same as ?id=number

            const user: Product | null = await ProductService.getProductById(String(req.query.id))

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

ProductRouter.get('/:productId', validationMiddleware(getProductByIdParamsSchema, 'params'), getProductByIdController);

/** POST /products  (Add New Product) */
ProductRouter.post('/', validationMiddleware(createProductBodySchema, 'body'),
    async (req: Request, res: Response) => {
        try {
            const { name, price, image, description, category } = req.body;

            const created = await ProductService.createProduct({
                name,
                price,
                image,
                description,
                category,
            });

            if (!created) {
                return ErrorJsonResponse(res, 400, 'Failed to create product');
            }
            return SuccessJsonResponse(res, 201, created);
        } catch (error) {
            return ErrorJsonResponse(res, 500, 'Failed to create product');
        }
    }
);

/** DELETE /products/:productId */
ProductRouter.delete('/:productId', validationMiddleware(deleteProductParamsSchema, 'params'),
    async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const ok = await ProductService.deleteProduct(String(productId));

            if (!ok) {
                return ErrorJsonResponse(res, 404, `product ${productId} not found or delete failed`);
            }
            return SuccessJsonResponse(res, 200, { deleted: true, id: productId });
        } catch (error) {
            return ErrorJsonResponse(res, 500, 'Failed to delete product');
        }
    }
);


export default ProductRouter