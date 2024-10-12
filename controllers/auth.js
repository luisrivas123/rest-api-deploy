import { validateData } from '../schemas/auth.js'
import bcrypt from 'bcrypt'

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

    const data = await this.datoModel.query({ input: result.data })

    const hashedPassword = data === null ? '' : data.password

    const isValid = await bcrypt.compare(result.data.password, hashedPassword)
    if (!isValid || !data) {
      return res.status(401).json({ error: 'Error de autenticación' })
    }
    res.status(201).json({ message: 'User autehicate' })
    return {
      phone: data.phone
    }
  }
}
