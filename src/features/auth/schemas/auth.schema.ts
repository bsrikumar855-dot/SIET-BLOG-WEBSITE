import { z } from "zod";

/**
 * Validation schema for the Login Form.
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(50, "Password must not exceed 50 characters."),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validation schema for the Registration Form.
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long."),
    email: z
      .string()
      .email("Please enter a valid academic email address.")
      .refine(
        (val) => val.endsWith(".edu.in") || val.endsWith(".edu") || val.includes("siet"),
        { message: "Must be a valid college or institutional email." }
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z.string(),
    role: z.enum(["student", "faculty", "writer"]),
    department: z.string().min(2, "Please select or specify your department."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
