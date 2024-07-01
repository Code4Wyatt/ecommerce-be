import { Request, Response, NextFunction } from "express";
import { UnauthorisedException } from "../exceptions/unauthorised";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

declare module 'express' {
    interface Request {
        user?: User;
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return next(new UnauthorisedException('Unauthorized', ErrorCode.UNAUTHORISED));
    }

    try {
        const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any;

        const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });
        if (!user) {
            return next(new UnauthorisedException('Unauthorized', ErrorCode.UNAUTHORISED));
        }

        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorisedException('Unauthorized', ErrorCode.UNAUTHORISED));
    }
};

export default authMiddleware;
