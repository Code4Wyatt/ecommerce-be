import { NextFunction, Request, Response } from 'express'
import { prismaClient } from '..'
import { NotFoundException } from '../exceptions/not-found'
import { ErrorCode } from '../exceptions/root'
import { UnauthorisedException } from '../exceptions/unauthorised'

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
    const orders = await prismaClient.order.findMany({
        where: {
            userId: req.user!.id
        }
    })

    res.json(orders)
}

export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id
    const orderId = +req.params.id

    try {
        const order = await prismaClient.$transaction(async (tx) => {
            const existingOrder = await tx.order.findUnique({
                where: {
                    id: orderId
                }
            })

            if (!existingOrder) {
                throw new NotFoundException('Order not found.', ErrorCode.ORDER_NOT_FOUND)
            }

            if (existingOrder.userId !== userId) {
                throw new UnauthorisedException('You do not have permission to cancel this order.', ErrorCode.NOT_USERS_ORDER)
            }

            const updatedOrder = await tx.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: 'CANCELLED'
                }
            })

            await tx.orderEvent.create({
                data: {
                    orderId: updatedOrder.id,
                    status: 'CANCELLED'
                }
            })

            return updatedOrder
        })

        res.json(order)
    } catch (error) {
        console.log(error)
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                products: true,
                events: true
            }
        })

        res.json(order)
    } catch (error) {
        throw new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND)
    }
}

export const listAllOrders = async (req: Request, res: Response) => {
    let whereClause = {}
    const status = req.params.status
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;

    if (status) {
        whereClause = {
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: isNaN(skip) ? 0 : skip,
        take: 5
    })

    res.json(orders)
}

export const changeOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = +req.params.id
        const newStatus = req.body.status

        const order = await prismaClient.$transaction(async (tx) => {
            const updatedOrder = await tx.order.update({
                where: {
                    id: orderId
                },
                data: {
                    status: newStatus
                }
            })

            await tx.orderEvent.create({
                data: {
                    orderId: updatedOrder.id,
                    status: newStatus
                }
            })

            return updatedOrder
        })

        res.json(order)
    } catch (error) {
        if (error instanceof Error) {
            if ((error as any).code === 'P2025') { // Prisma error code for "Record not found"
                next(new NotFoundException('Order not found', ErrorCode.ORDER_NOT_FOUND))
            } else {
                next(error)
            }
        } else {
            next(new Error('An unknown error occurred'))
        }
    }
}

export const listUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
    let whereClause: any = {
        userId: +req.params.id
    }
    
    const status = req.params.status

    if (status) {
        whereClause = {
            ...whereClause,
            status
        }
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        skip: isNaN(skip) ? 0 : skip,
        take: 5
    })

    res.json(orders)
}