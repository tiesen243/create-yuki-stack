import * as z from 'zod/v4'

const passwordRegex = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    error: 'Password not strong enough',
  })

export const signInSchema = z.object({
  email: z.email(),
  password: passwordRegex,
})

export const signUpSchema = z
  .object({
    name: z.string(),
    email: z.email(),
    password: passwordRegex,
    confirmPassword: passwordRegex,
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ['confirmPassword'],
    error: 'Passwords do not match',
  })

export const changePasswordSchema = z
  .object({
    currentPassword: passwordRegex.optional(),
    newPassword: passwordRegex,
    confirmNewPassword: passwordRegex,
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    error: 'Passwords do not match',
  })
