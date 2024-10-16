import { validateData, validatePartialData } from '../schemas/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = process.env.SALT_ROUNDS ?? 5

export class UserController {
  constructor({ datoModel }) {
    this.datoModel = datoModel
  }

  getAll = async (req, res) => {
    // const { genre } = req.query
    // const datos = await this.datoModel.getAll({ genre })
    const datos = await this.datoModel.getAll()
    res.json(datos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    try {
      const dato = await this.datoModel.getById({ id })
      if (!dato) return res.status(404).json({ message: 'user not found' })
      return res.json(dato)
    } catch (error) {
      res.status(404).json({ message: 'user not found' })
    }
  }

  create = async (req, res) => {
    const result = validateData(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newData = await this.datoModel.create({ input: result.data })

    if (newData.errno) {
      return res.status(401).json({ error: 'Error creando usuario' })
    }

    const token = jwt.sign(
      { id: newData.id, phone: newData.phone },
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: '30m'
      }
    )
    res
      .cookie('access_token', token, {
        httpOnly: true, // LA cookie solo se puede acceder en el servidor
        secure: process.env.NODE_ENV === 'production', // La cookie solo se pudede acceder en https
        sameSite: 'strict', // la coockie solo se puede acceder en el mismo dominio
        maxAge: 1000 * 60 * 60 // la cookie tiene un tiempo de validez de una hora
      })
      .status(201)
      .send({ phone: newData.phone, token })
    // res.status(201).json(newData)

    const hashedPassword = await bcrypt.hash(
      result.data.password,
      parseInt(SALT_ROUNDS)
    )

    const authData = {
      id: newData.id,
      email: result.data.email,
      phone: result.data.phone,
      password: hashedPassword
    }

    const newAuthData = await this.datoModel.createUserAuth({ authData })
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
