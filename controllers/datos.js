import { validateData, validatePartialData } from '../schemas/datos.js'

export class DatoController {
  constructor ({ datoModel }) {
    this.datoModel = datoModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const datos = await this.datoModel.getAll({ genre })
    res.json(datos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const dato = await this.datoModel.getById({ id })
    if (dato) return res.json(dato)
    res.status(404).json({ message: 'movie not found' })
  }

  create = async (req, res) => {
    const result = validateData(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newData = await this.datoModel.create({ input: result.data })

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
