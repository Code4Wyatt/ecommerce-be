import { Router } from "express"
import { errorHandler } from "../error-handler"
import authMiddleware from "../middlewares/auth"
import adminMiddleware from "../middlewares/admin"
import { addAddress, deleteAddress, listAddress, updateUser } from "../controllers/users"

const usersRoutes: Router = Router()

usersRoutes.post('/address', [authMiddleware], errorHandler(addAddress))
usersRoutes.delete('/address/:id', [authMiddleware, adminMiddleware], errorHandler(deleteAddress))
usersRoutes.get('/address', [authMiddleware], errorHandler(listAddress))
usersRoutes.put('/', [authMiddleware], errorHandler(updateUser))

export default usersRoutes