import { validateData, validatePartialData } from '../schemas/cargo-delivery.js'

export class CragoDeliveryController {
  constructor({ datoModel }) {
    this.datoModel = datoModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const { user } = req.session

    if (!user) return res.status(403).send('Access not authorized')

    const user_id = user.id

    const datos = await this.datoModel.getAllCargoDelivery({ genre, user_id })

    if (!datos)
      return res.status(404).json({ message: 'Cargo delivery not found' })

    res.json(datos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const { user } = req.session

    if (!user) return res.status(403).send('Access not authorized')

    const user_id = user.id

    try {
      const dato = await this.datoModel.getByIdCargoDelivery({ user_id, id })
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

    result.data.user_id = user.id

    const newData = await this.datoModel.createCargoDelivery({
      input: result.data
    })

    if (newData.errno) {
      return res.status(400).json({ error: 'Error creando solicitud de carga' })
    }

    res.status(201).json(newData)
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
