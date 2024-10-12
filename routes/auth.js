import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'

export const createAuthRouter = ({ datoModel }) => {
  const authRouter = Router()

  const authController = new AuthController({ datoModel })

  authRouter.post('/', authController.login)

  return authRouter
}
