import { Router } from 'express'
import { DatoController } from '../controllers/datos.js'

export const createDatoRouter = ({ datoModel }) => {
  const datosRouter = Router()

  const datoController = new DatoController({ datoModel })

  datosRouter.get('/', datoController.getAll)

  datosRouter.get('/:id', datoController.getById)

  datosRouter.post('/', datoController.create)

  datosRouter.patch('/:id', datoController.update)

  datosRouter.delete('/:id', datoController.delete)

  return datosRouter
}
