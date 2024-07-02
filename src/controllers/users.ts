import { Request, Response } from "express"
import { AddressSchema } from "../schema/users"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"
import { prismaClient } from ".."
import { User } from "@prisma/client"

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