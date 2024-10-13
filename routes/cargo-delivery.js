import { Router } from 'express'
import { CragoDeliveryController } from '../controllers/cargo-delivery.js'

export const createCargoDeliveryRouter = ({ datoModel }) => {
  const cargoDeliveryRouter = Router()

  const cargoDeliveryController = new CragoDeliveryController({ datoModel })

  cargoDeliveryRouter.get('/', cargoDeliveryController.getAll)

  cargoDeliveryRouter.get('/:id', cargoDeliveryController.getById)

  cargoDeliveryRouter.post('/', cargoDeliveryController.create)

  cargoDeliveryRouter.patch('/:id', cargoDeliveryController.update)

  cargoDeliveryRouter.delete('/:id', cargoDeliveryController.delete)

  return cargoDeliveryRouter
}
