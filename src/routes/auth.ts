import { Router } from 'express'
import { signUp } from '../controllers/auth'

const authRoutes: Router = Router()

authRoutes.post('/login', signUp)

export default authRoutes