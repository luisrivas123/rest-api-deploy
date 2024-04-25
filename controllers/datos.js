import { DatoModel } from '../models/mysql/dato.js'
import { validateData, validatePartialData } from '../schemas/datos.js'

export class DatoController {
  static async getAll (req, res) {
    const { genre } = req.query
    const datos = await DatoModel.getAll({ genre })
    res.json(datos)
  }

  static async getById (req, res) {
    const { id } = req.params
    const dato = await DatoModel.getById({ id })
    if (dato) return res.json(dato)
    res.status(404).json({ message: 'movie not found' })
  }

  static async create (req, res) {
    const result = validateData(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newData = await DatoModel.create({ input: result.data })

    res.status(201).json(newData)
  }

  static async update (req, res) {
    const result = validatePartialData(req.body)

    if (!result.success) {
      return res.status(404).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params

    const updateDato = await DatoModel.update({ id, input: result.data })

    return res.json(updateDato)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await DatoModel.delete({ id })
    if (result === false) {
      return res.status(400).json({ error: 'Dato not found' })
    }
    return res.json({ message: 'Dato delete' })
  }
}
