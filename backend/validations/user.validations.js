import { email, z } from "zod";

export const loginValidation = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password Should atleast 6 characters"),
});
export const signupValidation = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid Email Format"),
  password: z
    .string()

    .min(6, "Password Should atleast 6 characters"),
});
