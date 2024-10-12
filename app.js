import express, { json } from 'express'

import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { createDatoRouter } from './routes/datos.js'
import { createUserRouter } from './routes/user.js'
import { createAuthRouter } from './routes/auth.js'
import { corsMiddleware } from './middlewares/cors.js'

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
      const data = jwt.verify(token, process.dev.SECRET_JWT_KEY)
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

  const PORT = process.env.PORT ?? 3000

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
  })
}
