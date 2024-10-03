import z from 'zod'

const userSchema = z.object({
  name: z.string({
    invalid_type_error: 'name title must be a string',
    required_error: 'name title is required'
  }),
  lastname: z.string({
    invalid_type_error: 'lastname title must be a string',
    required_error: 'lastname title is required'
  }),
  document_type: z.enum(['cedula', 'pasaporte'], {
    required_error: 'Document type genre is required',
    invalid_type_error: 'movie genre must be array of enum genre'
  }),
  document_id: z.string(),
  // phone: z.string().transform((data) => Number(data)),
  phone: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

export function validateData(input) {
  return userSchema.safeParse(input)
}

export function validatePartialData(input) {
  return userSchema.partial().safeParse(input)
}
