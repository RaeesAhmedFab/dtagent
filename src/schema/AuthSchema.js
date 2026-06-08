import z from "zod"


export const AdminLoginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
})

export const ForgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
})

export const ResetPasswordSchema = z
    .object({
        password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })