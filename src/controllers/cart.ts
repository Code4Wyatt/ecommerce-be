import { NextFunction, Request, Response } from 'express'
import { ChangeQuantitySchema, CreateCartSchema } from '../schema/cart'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'
import { Product } from '@prisma/client'
import { prismaClient } from '..'
import { UnauthorisedException } from '../exceptions/unauthorised'

export const addItemToCart = async (req: Request, res: Response) => {
    const validatedData = CreateCartSchema.parse(req.body)
    let product: Product
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }

    const existingCartItem = await prismaClient.cartItem.findFirst({
        where: {
            userId: req.user!.id,
            productId: product.id,
        },
    });

    let cartItem;
    if (existingCartItem) {
        cartItem = await prismaClient.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity + 1,
            },
        });
    } else {
        cartItem = await prismaClient.cartItem.create({
            data: {
                userId: req.user!.id,
                productId: product.id,
                quantity: validatedData.quantity,
            },
        });
    }

    const cart = await prismaClient.cartItem.create({
        data: {
            userId: req.user!.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })

    res.json(cart)
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    const cartItemId = +req.params.id
    const userId = req.user!.id

    const cartItem = await prismaClient.cartItem.findUnique({
        where: {
            id: cartItemId
        }
    })

    if (!cartItem) {
        throw new NotFoundException('Cart item not found', ErrorCode.CART_ITEM_NOT_FOUND)
    }

    if (cartItem.userId !== userId) {
        throw new UnauthorisedException('You are not authorised to delete this cart item', ErrorCode.NOT_USERS_CART_ITEM)
    }

    await prismaClient.cartItem.delete({
        where: {
            id: cartItemId
        }
    })

    res.json({ success: true })
}

export const changeQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = ChangeQuantitySchema.parse(req.body)
        const cartItemId = +req.params.id
        const userId = req.user!.id

        const cartItem = await prismaClient.cartItem.findUnique({
            where: {
                id: cartItemId
            }
        })

        if (!cartItem) {
            throw new NotFoundException('Cart item not found', ErrorCode.CART_ITEM_NOT_FOUND);
        }

        if (cartItem.userId !== userId) {
            throw new UnauthorisedException('You do not have permission to edit this item', ErrorCode.NOT_USERS_CART_ITEM);
        }

        const updatedCart = await prismaClient.cartItem.update({
            where: {
                id: cartItemId
            },
            data: {
                quantity: validatedData.quantity
            }
        })

        res.json(updatedCart)
    } catch (error) {
        next(error)
    }
}

export const getCart = async (req: Request, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: req.user!.id
        },
        include: {
            product: true
        }
    })

    res.json(cart)
}