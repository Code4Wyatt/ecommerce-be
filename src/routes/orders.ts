import { Router } from "express"
import { errorHandler } from "../error-handler"
import authMiddleware from "../middlewares/auth"
import { cancelOrder, createOrder, getOrderById, listOrders } from "../controllers/orders"

const ordersRoutes: Router = Router()

ordersRoutes.post('/', [authMiddleware], errorHandler(createOrder))
ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders))
ordersRoutes.delete('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))

export default ordersRoutes