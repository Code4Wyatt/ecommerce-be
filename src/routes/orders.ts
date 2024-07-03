import { Router } from "express"
import { errorHandler } from "../error-handler"
import authMiddleware from "../middlewares/auth"
import adminMiddleware from "../middlewares/admin"
import { cancelOrder, changeOrderStatus, createOrder, getOrderById, listAllOrders, listOrders } from "../controllers/orders"

const ordersRoutes: Router = Router()

ordersRoutes.post('/', [authMiddleware], errorHandler(createOrder))
ordersRoutes.get('/', [authMiddleware], errorHandler(listOrders))
ordersRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder))
ordersRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById))
ordersRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders))
ordersRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(cancelOrder))
ordersRoutes.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(changeOrderStatus))

export default ordersRoutes