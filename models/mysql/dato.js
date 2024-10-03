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
    const [datos] = await connection.query(
      `SELECT title, poster, year, BIN_TO_UUID(id) id 
        FROM dato WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (datos.length === 0) return null

    return datos[0]
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
      console.log(e)

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
    const { id, email, password } = authData

    try {
      await connection.query(
        `INSERT INTO auth (id, email, password)
        VALUES (?, ?, ?)`,
        [id, email, password]
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
}
