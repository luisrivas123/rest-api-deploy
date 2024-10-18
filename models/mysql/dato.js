import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB
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

  static async getAllCargoDelivery({ user_id }) {
    try {
      const [datos] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, type_cargo, description_cargo, oringin_cargo, destiny_cargo, height_cargo, length_cargo, width_cargo, weight_cargo, with_load, with_schedule, payment_method, delivery_request_status, create_at 
          FROM cargo WHERE user_id = UUID_TO_BIN(?);`,
        [user_id]
      )

      if (datos.length === 0) return null

      return datos
    } catch (e) {
      // throw new Error('Error creating dato')
      //   if (e.errno) {
      //     return { message: 'user not found' }
      //   }
      return e
    }
  }

  static async getById({ user_id, id }) {
    try {
      const [datos] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, type_cargo, description_cargo, oringin_cargo, destiny_cargo, height_cargo, length_cargo, width_cargo, weight_cargo, with_load, with_schedule, payment_method, delivery_request_status, create_at 
          FROM cargo WHERE user_id = UUID_TO_BIN(?) AND id = UUID_TO_BIN(?);`,
        [user_id, id]
      )

      if (datos.length === 0) return null

      return datos[0]
    } catch (e) {
      throw new Error('Error creating dato')
      //   if (e.errno) {
      //     return { message: 'user not found' }
      //   }
      //   return 'otro'
    }
  }

  static async getByIdCargoDelivery({ id }) {
    try {
      const [datos] = await connection.query(
        `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, type_cargo, description_cargo, oringin_cargo, destiny_cargo, height_cargo, length_cargo, width_cargo, weight_cargo, with_load, with_schedule, payment_method, delivery_request_status, create_at 
          FROM cargo WHERE id = UUID_TO_BIN(?);`,
        [id]
      )

      if (datos.length === 0) return null

      return datos[0]
    } catch (e) {
      throw new Error('Error creating dato')
      //   if (e.errno) {
      //     return { message: 'user not found' }
      //   }
      //   return 'otro'
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

  static async createCargoDelivery({ input }) {
    const {
      user_id,
      type_cargo,
      description_cargo,
      oringin_cargo,
      destiny_cargo,
      height_cargo,
      length_cargo,
      width_cargo,
      weight_cargo,
      with_load,
      with_schedule,
      payment_method,
      delivery_request_status = 'pending'
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO cargo (id, user_id, type_cargo, description_cargo, oringin_cargo, destiny_cargo, height_cargo, length_cargo, width_cargo, weight_cargo, with_load, with_schedule, payment_method, delivery_request_status)
        VALUES (UUID_TO_BIN("${uuid}"), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id,
          type_cargo,
          description_cargo,
          oringin_cargo,
          destiny_cargo,
          height_cargo,
          length_cargo,
          width_cargo,
          weight_cargo,
          with_load,
          with_schedule,
          payment_method,
          delivery_request_status
        ]
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
      `SELECT BIN_TO_UUID(id) id, BIN_TO_UUID(user_id) user_id, type_cargo, description_cargo, oringin_cargo, destiny_cargo, height_cargo, length_cargo, width_cargo, weight_cargo, with_load, with_schedule, payment_method, delivery_request_status, create_at 
        FROM cargo WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return dato[0]
  }

  static async insertCargoDelivery({ input }) {
    const { user_id, cargo_id } = input

    try {
      await connection.query(
        `INSERT INTO user_cargo SET user_id = UUID_TO_BIN(?), cargo_id = UUID_TO_BIN(?)`,
        [user_id, cargo_id]
      )
      // await connection.query(`INSERT INTO user_cargo SET ?`, [input])
    } catch (e) {
      // Pueden enviarle información sensible
      // throw new Error('Error creating dato')
      // Enviar la traza a un sercicio interno
      // sendLog(e)
      console.log(e)
      // return e
    }
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

  static async delete({ id }) {
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
  }

  static async update({ id, input }) {}

  static async query({ input }) {
    // const { phone } = input

    try {
      const [datos] = await connection.query(
        'SELECT * FROM auth WHERE phone = ?;',
        [input]
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
