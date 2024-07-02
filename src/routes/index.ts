import { Router } from "express"
import authRoutes from "./auth"
import productsRoutes from "./products"
import usersRoutes from "./users"
import cartRoutes from "./cart"

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/products', productsRoutes)
rootRouter.use('/users', usersRoutes)
rootRouter.use('/cart', cartRoutes)

export default rootRouter