import { Router } from 'express'
import { login, signUp } from '../controllers/auth'

const authRoutes: Router = Router()

authRoutes.post('/signup', signUp)
authRoutes.post('/login', login)

export default authRoutes