import { Router } from 'express'
import { DatoController } from '../controllers/datos.js'

export const datosRouter = Router()

datosRouter.get('/', DatoController.getAll)

datosRouter.get('/:id', DatoController.getById)

datosRouter.post('/', DatoController.create)

datosRouter.patch('/:id', DatoController.update)

datosRouter.delete('/:id', DatoController.delete)
