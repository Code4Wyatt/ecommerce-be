import { Request, Response } from "express"
import { AddressSchema, UpdateUserSchema } from "../schema/users"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"
import { prismaClient } from ".."
import { Address } from "@prisma/client"
import { BadRequestsException } from "../exceptions/bad-requests"

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user!.id
        }
    })

    res.json(address)
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        })

        res.json({ success: true })
    } catch (error) {
        throw new NotFoundException('Address not found', ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: req.user!.id
        }
    })

    res.json(addresses)
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body)
    let shippingAddress: Address;
    let billingAddress: Address;

    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }

        if (shippingAddress.userId != req.user!.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.NOT_USERS_ADDRESS)
        }
    }

    if (validatedData.defaultBillingAddress) {
        try { 
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
        }

        if (billingAddress.userId != req.user!.id) {
            throw new BadRequestsException('Address does not belong to user', ErrorCode.NOT_USERS_ADDRESS)
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: req.user!.id
        },
        data: validatedData
    })

    res.json(updatedUser)
}