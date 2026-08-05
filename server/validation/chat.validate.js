import z from "zod";

export const chatSchema = z.object({
  firstname: z.string("firstname is required").trim(),
  lastname: z.string("lastname is required").trim(),
  email: z.email("email is required").trim(),
});
