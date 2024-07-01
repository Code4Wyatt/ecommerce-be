import { Router } from "express"
import { errorHandler } from "../error-handler"
import { createProduct } from "../controllers/products"

const productsRoutes: Router = Router()

productsRoutes.post('/', errorHandler(createProduct))

export default productsRoutes