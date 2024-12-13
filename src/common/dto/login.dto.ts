import { z } from "zod";

export const LoginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export type LoginSchema = z.infer<typeof LoginSchema>;
export type LoginDto = LoginSchema;