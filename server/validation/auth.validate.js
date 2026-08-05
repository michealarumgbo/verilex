import z from "zod";

export const regSchema = z.object({
  firstname: z.string("firstname is required").trim(),
  lastname: z.string("lastname is required").trim(),
  email: z.email("email is required").trim(),
});

export const loginSchema = z.object({
  email: z.email("email is required").trim(),
  password: z.string("password is required").min(8).trim(),
});

export const updatePasswordSchema = z.object({
  password: z.string("password is required").min(8).trim(),
});
