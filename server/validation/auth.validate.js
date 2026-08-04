import z from "zod";

export const regSchema = z.object({
  firstname: z.string("firstname is required").trim(),
  lastname: z.string("lastname is required").trim(),
  email: z.email("email is required").trim(),
});

export const loginSchema = z.object({
  email: z.email("Email is required").trim(),
  password: z.string("First Name is required").min(8).trim(),
});
