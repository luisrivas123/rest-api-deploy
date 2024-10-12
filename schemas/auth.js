import z from 'zod'

const authSchema = z.object({
  phone: z.string(),
  password: z.string().min(6)
})

export function validateData(input) {
  return authSchema.safeParse(input)
}

export function validatePartialData(input) {
  return authSchema.partial().safeParse(input)
}
