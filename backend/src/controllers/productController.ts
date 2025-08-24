/* RMIT University Vietnam 
# Course: COSC2769 - Full Stack Development 
# Semester: 2025B 
# Assessment: Assignment 02 
# Author: Nguyen Vo Truong Toan
# ID: s3979056 */

import * as z from "zod";
import { Request, Response } from "express";
import {ProductInsertNoId, ProductService } from "../service/products.service";
import { ErrorJsonResponse, SuccessJsonResponse } from "../utils/json_mes";

export const getProductsQuerrySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(30).default(10),
    category: z.string().trim().max(100).optional(),
    priceMin: z.coerce.number().min(0).optional(),
    priceMax: z.coerce.number().min(0).max(100000000).optional(),
    name: z.string().optional(),
}).strict();


type GetProductsQuerryType = z.output<typeof getProductsQuerrySchema>;

// Request < params type, response body, request body, request query
export const getProductsController = async (req: Request, res: Response) => {
    try {

        const userRole = req.user_role;
        if (userRole === "customer") {
            const { page, size, category, priceMin, priceMax, name } = (req as unknown as Record<string, unknown> & { validatedquery: GetProductsQuerryType }).validatedquery;

            const products = await ProductService.getCustomerProducts(
                { page, size },
                { category, priceMax, priceMin, name }
            );

            if (products === null) {
                return ErrorJsonResponse(res, 500, "Failed to fetch products");
            }

            return SuccessJsonResponse(res, 200, {
                data: { products, count: products.length },
            });
        }
        else if (userRole === "vendor") {
            const { page, size } = (req as unknown as Record<string, unknown> & { validatedquery: GetProductsQuerryType }).validatedquery;

            const vendorId = req.user_id;

            const products = await ProductService.getVendorProducts(
                { page, size }, vendorId,
            )

            if (products === null) {
                return ErrorJsonResponse(res, 500, "Failed to fetch products");
            }

            return SuccessJsonResponse(res, 200, {
                data: { products, count: products.length },
            });
        }

        return res.status(403).json({ message: "Forbidden: missing or invalid role" });


    } catch (err: any) {
        if (err?.issues) {
            return ErrorJsonResponse(res, 400, err.issues[0].message);
        }
        console.log('ERRRRR: ', err);
        return ErrorJsonResponse(res, 500, "Unexpected error while fetching products");
    }
}

export const getProductByIdParamsSchema = z.object({
    productId: z.string(),
}).strict();

type GetProductByIdParams = z.output<typeof getProductByIdParamsSchema>;

export const getProductByIdController = async (req: Request, res: Response) => {
    const { productId } = (req as unknown as Record<string, unknown> & { validatedparams: GetProductByIdParams }).validatedparams;

    const product = await ProductService.getProductById(productId);

    if (!product) {
        return ErrorJsonResponse(res, 404, 'Product is not found');
    }

    return SuccessJsonResponse(res, 200, {
        data: {
            product
        }
    });
}

export const createProductParamsSchema = z.object({
    name: z.string().trim(),
    price: z.coerce.number().min(0),
    description: z.string().trim(),
    image: z.string().trim(),
    category: z.string().trim().min(1),
    instock: z.coerce.boolean(),
}).strict();

declare global {
    namespace Express {
        interface Request {
            validatedbody?: {
                name: string; price: number; description: string;
                image: string; category: string; instock: boolean;
            };
        }
    }
}

export const createProductController = async (req: Request, res: Response) => {
    try {
        const vendorId = req.user_id;

        const body = req.validatedbody!; // do middleware set
        const payload: ProductInsertNoId = { vendor_id: vendorId, ...body };

        const created = await ProductService.createProduct(payload);
        if (!created) return res.status(500).json({ message: "Failed to create product" });

        return res.status(201).json({ data: { product: created } });

    } catch (err: any) {
        console.error("createProductController error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            detail: err.message ?? "Unexpected error while creating products",
        });
    }
};

export const updateProductStatusBodySchema = z.object({
    instock: z.coerce.boolean(),
}).strict();

export const updateProductStatusController = async (req: Request, res: Response) => {
    try {
        const vendorId = req.user_id;
        const { productId } = req.params;
        const { instock } = req.body;

        const updated = await ProductService.updateProductStatus(
            vendorId as string,
            productId as string,
            instock as boolean);

        if (!updated) {
            return res.status(404).json({ message: "Product not found or not owned by vendor" });
        }

        return SuccessJsonResponse(res, 200, {
            message: "Update Status Success",
            product: updated,

        });

    } catch (err: any) {
        console.error("updateProductStatusController error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            detail: err.message ?? "Unexpected error while updating product status",
        });
    }
};

// export const deleteProductController = async (req: Request, res: Response) => {
//   try {
//     const vendorId = req.user_id as string;
//     const { productId } = req.params as { productId: string };

//     const deleted = await ProductService.deleteProductByVendor(vendorId, productId);

//     if (!deleted) {
//       return res
//         .status(404)
//         .json({ message: "Product not found or not owned by vendor" });
//     }

//     // 204 No Content là chuẩn cho delete thành công
//     return res.status(204).send();
//     // Hoặc nếu muốn trả data:
//     // return res.status(200).json({ message: "Deleted", product: deleted });
//   } catch (err: any) {
//     console.error("deleteProductController error:", err);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       detail: err.message ?? "Unexpected error while deleting product",
//     });
//   }
// };