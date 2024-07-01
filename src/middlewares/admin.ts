import { Request, Response, NextFunction } from "express";
import { UnauthorisedException } from "../exceptions/unauthorised";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

declare module 'express' {
    interface Request {
        user?: User
    }
}

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (user?.role == 'ADMIN') {
        next()
    } else {
        next(new UnauthorisedException('Unauthorized', ErrorCode.UNAUTHORISED));
    }
}

export default adminMiddleware
