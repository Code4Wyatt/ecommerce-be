import { NextFunction, Request, Response } from "express"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"

export const createProduct = async (req: Request, res: Response) => {
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })

    res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body
        if (product.tags) {
            product.tags = product.tags.join(',')
        }

        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })

        res.json(updatedProduct)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const deletedProduct = await prismaClient.product.delete({
            where: {
                id: +id,
            },
        });

        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        next(new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND));
    }
}

export const listProducts = async (req: Request, res: Response) => {
    try {
        const { skip = 0, take = 5, search, minPrice, maxPrice, tags } = req.query;

        const count = await prismaClient.product.count();

        const products = await prismaClient.product.findMany({
            skip: +skip,
            take: +take,
        });

        res.json({ count, data: products });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while listing products' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })

        res.json(product)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const searchProducts = async (req: Request, res: Response) => {
    const products = await prismaClient.product.findMany({
        where: {
            name: {
                search: req.query.q?.toString()
            },
            description: {
                search: req.query.q?.toString()
            },
            tags: {
                search: req.query.q?.toString()
            }
        }
    })

    res.json(products)
}