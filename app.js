import express, { json } from 'express'

import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { createDatoRouter } from './routes/datos.js'
import { createUserRouter } from './routes/user.js'
import { createAuthRouter } from './routes/auth.js'
import { createCargoDeliveryRouter } from './routes/cargo-delivery.js'
import { corsMiddleware } from './middlewares/cors.js'

const SECRET_JWT_KEY = 'Hola'

export const createApp = ({ datoModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.use(cookieParser())
  app.disable('x-powered-by')

  app.use((req, res, next) => {
    const token = req.cookies.access_token

    req.session = { user: null }

    try {
      const data = jwt.verify(token, process.env.SECRET_JWT_KEY)
      req.session.user = data
    } catch {}

    next()
  })

  app.get('/', (req, res) => {
    res.send('<h1>Server up</h1>')
  })

  app.use('/datos', createDatoRouter({ datoModel }))
  app.use('/user', createUserRouter({ datoModel }))
  app.use('/login', createAuthRouter({ datoModel }))
  app.use('/cargo-delivery', createCargoDeliveryRouter({ datoModel }))

  app.post('/logout', (req, res) => {
    res.clearCookie('access_token').json({ message: 'Logout successful' })
  })

  app.get('/protected', (req, res) => {
    const { user } = req.session
    console.log(user)

    if (!user) return res.status(403).send('Access not authorized')
    res.send('<h1>Hola</h1>')

    // try {
    //   const data = jwt.verify(token, SECRET_JWT_KEY)
    //   res.render('protected', data)
    // } catch (error) {
    //   res.status(401).send('Access not authorized')
    // }
  })

  const PORT = process.env.PORT ?? 4000

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
