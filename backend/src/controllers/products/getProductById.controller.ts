import { Request, Response } from "express";
import { ProductService } from "../../service/products.service";

export const getProductByIdController = (req: Request, res: Response) => {
    const { productId } = req.params;

    const product = ProductService.getProductById(productId);

    if (!product) {
        return res.status(404).json({
            message: 'Product is not found'
        });
    }

    return res.status(200).json({
        product
    });
}