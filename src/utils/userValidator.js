import { email, z } from 'zod'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const emailSchema = z.email({
  pattern: emailRegex,
  message: 'Invalid email format',
})

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/

const passwordSchema = z
  .string()
  .min(8, { message: 'Passowrd must be at least 8 character long' })
  .max(14, { message: 'Passowrd must be at most 14 character long' })
  .regex(passwordRegex,{message : "password must be contain at least on uppercase , one lowercase ,one number and one special character"})


export const signupSchema = z.object({
    username : z.string().min(3).max(20),
    email : emailSchema,
    password : passwordSchema,
    confirmPassword : passwordSchema,
    age :z.coerce.number().min(5).max(80),
    gender : z.string()
}).refine((data)=>data.password==data.confirmPassword,{
    message : "password do not match with confirm password",
    path : ["confirmPassword"]
})

export const signinSchema = z.object({
    email : emailSchema,
    password : passwordSchema
})

export const resetPasswordSchema = z.object({
  password : passwordSchema,
  confirmPassword : passwordSchema
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email : emailSchema
})

export const editProfileSchema = z.object({
   username : z.string().min(3).max(20),
   age :z.coerce.number().min(5).max(80),
   gender : z.string()
})

export const changePasswordSchema = z.object({
  oldPassword:passwordSchema,
  newPassword:passwordSchema
}).refine((data)=>data.oldPassword!==data.newPassword,{
   message: "new Password must be different",
  path: ["confirmPassword"],
})


