import { parse } from 'uuid'
import { validateData, validatePartialData } from '../schemas/cargo-delivery.js'

export class CragoDeliveryController {
  constructor({ datoModel }) {
    this.datoModel = datoModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const datos = await this.datoModel.getAllCargoDelivery({ genre })
    res.json(datos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    try {
      const dato = await this.datoModel.getByIdCargoDelivery({ id })
      if (!dato)
        return res.status(404).json({ message: 'Cargo delivery not found' })
      return res.json(dato)
    } catch (error) {
      res.status(404).json({ message: 'Cargo delivery not found' })
    }
  }

  create = async (req, res) => {
    const { user } = req.session

    if (!user) return res.status(403).send('Access not authorized')

    const result = validateData(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newData = await this.datoModel.createCargoDelivery({
      input: result.data
    })

    res.status(201).json(newData)

    const input = {
      user_id: Buffer.from(parse(user.id)),
      cargo_id: Buffer.from(parse(newData.id))
    }

    await this.datoModel.insertCargoDelivery({ input })
  }

  update = async (req, res) => {
    const result = validatePartialData(req.body)

    if (!result.success) {
      return res.status(404).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updateDato = await this.datoModel.update({ id, input: result.data })

    return res.json(updateDato)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.datoModel.delete({ id })
    if (result === false) {
      return res.status(400).json({ error: 'Dato not found' })
    }
    return res.json({ message: 'Dato delete' })
  }
}
