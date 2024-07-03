import { Request, Response } from 'express'
import { prismaClient } from '..'

export const createOrder = async (req: Request, res: Response) => {
    return await prismaClient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user!.id
            },
            include: {
                product: true
            }
        })

        if (cartItems.length === 0) {
            res.json({ message: 'Cart is empty.'})
        }

        const price = cartItems.reduce((prev, curr) => {
            return prev + (curr.quantity * +curr.product.price)
        }, 0)

        const address = await tx.address.findFirst({
            where: {
                id: req.user!.defaultShippingAddress!
            }
        })

        const order = await tx.order.create({
            data: {
                userId: req.user!.id,
                netAmount: price,
                address: address!.formattedAddress!,
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })

        await tx.orderEvent.create({
            data: {
                orderId: order.id
            }
        })

        await tx.cartItem.deleteMany({
            where: {
                userId: req.user!.id
            }
        })

        return res.json(order)
    })
}

export const listOrders = async (req: Request, res: Response) => {
    
}

export const cancelOrder = async (req: Request, res: Response) => {
    
}

export const getOrderById = async (req: Request, res: Response) => {
    
}