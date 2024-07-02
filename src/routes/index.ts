import { Router } from "express"
import authRoutes from "./auth"
import productsRoutes from "./products"
import usersRoutes from "./users"

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/products', productsRoutes)
rootRouter.use('/users', usersRoutes)

export default rootRouter