import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const RegisterSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["admin", "user"]),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
export class RegisterDto extends createZodDto(RegisterSchema) {}