import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  port: process.env.MYSQL_PORT || '3306',
  password: process.env.MYSQL_PASS || 'password',
  database: process.env.MYSQL_DB || 'mystore'
}

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(connectionString)

export class DatoModel {
  static async getAll() {
    const [datos] = await connection.query(
      'SELECT BIN_TO_UUID(id) id, name, lastname, document_type, document_id, phone, email FROM user;'
    )
    return datos
  }

  static async getById({ id }) {
    try {
      const [datos] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, name, lastname, document_type, document_id, phone, email 
          FROM user WHERE id = UUID_TO_BIN(?);`,
        [id]
      )

      if (datos.length === 0) return null

      return datos[0]
    } catch (e) {
      if (e.errno) {
        return { error: 'user not found' }
      }
      return 'otro'
    }
  }

  static async create({ input }) {
    const { name, lastname, document_type, document_id, phone, email } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO user (id, name, lastname, document_type, document_id, phone, email)
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?)`,
        [name, lastname, document_type, document_id, phone, email]
      )
    } catch (e) {
      // Pueden enviarle información sensible
      // throw new Error('Error creating dato')
      // Enviar la traza a un sercicio interno
      // sendLog(e)
      // console.log(e)

      return e
    }

    const [dato] = await connection.query(
      `SELECT name, lastname, document_type, document_id, phone, email, BIN_TO_UUID(id) id, create_at 
        FROM user WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return dato[0]
  }

  static async createUserAuth({ authData }) {
    const { id, email, phone, password } = authData

    try {
      await connection.query(
        `INSERT INTO auth (id, email, phone, password)
        VALUES (UUID_TO_BIN("${id}"), ?, ?, ?)`,
        [email, phone, password]
      )
    } catch (e) {
      // Pueden enviarle información sensible
      // throw new Error('Error creating dato')
      // Enviar la traza a un sercicio interno
      // sendLog(e)
      console.log(e)

      return e
    }
  }

  static async delete({ id }) {}

  static async update({ id, input }) {}

  static async query({ input }) {
    const { phone } = input

    try {
      const [datos] = await connection.query(
        'SELECT * FROM auth WHERE phone = ?;',
        [phone]
      )

      if (datos.length === 0) return null

      return datos[0]
    } catch (e) {
      console.log(e)
      if (e.errno) {
        return { error: 'user not found' }
      }
      return 'otro'
    }
  }
}
