import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const createUserRouter = ({ datoModel }) => {
  const userRouter = Router()

  const userController = new UserController({ datoModel })

  userRouter.get('/', userController.getAll)

  userRouter.get('/:id', userController.getById)

  userRouter.post('/', userController.create)

  userRouter.patch('/:id', userController.update)

  userRouter.delete('/:id', userController.delete)

  return userRouter
}
