import { Router } from "express"
import { errorHandler } from "../error-handler"
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products"
import authMiddleware from "../middlewares/auth"

const productsRoutes: Router = Router()

productsRoutes.post('/', [authMiddleware], errorHandler(createProduct))
productsRoutes.put('/:id', [authMiddleware], errorHandler(updateProduct))
productsRoutes.delete('/:id', [authMiddleware], errorHandler(deleteProduct))
productsRoutes.get('/', [authMiddleware], errorHandler(listProducts))
productsRoutes.get('/:id', [authMiddleware], errorHandler(getProductById))

export default productsRoutes