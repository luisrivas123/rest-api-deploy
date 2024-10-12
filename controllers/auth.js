import { validateData } from '../schemas/auth.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthController {
  constructor({ datoModel }) {
    this.datoModel = datoModel
  }

  login = async (req, res) => {
    const result = validateData(req.body)

    // console.log(result)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { phone, password } = result.data

    try {
      // const userAuth = Validation.login(phone, password)

      const data = await this.datoModel.query({ input: phone })

      const hashedPassword = data === null ? '' : data.password

      const isValid = await bcrypt.compare(password, hashedPassword)
      if (!isValid || !data) {
        // throw new Error('Error de autenticación')
        return res.status(401).json({ error: 'Error de autenticación' })
      }
      const token = jwt.sign(
        { id: data._id, phone: data.phone },
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
        .send({ phone, token })
    } catch (e) {
      res.status(401).json({ error: 'Error de autenticación' })
    }
  }
}
