import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const RegisterSchema = z.object({
    username: z.string(),
    emailId:z.string().email(),
    password: z.string(),
    createdBy: z.any(),
    role: z.enum(["admin", "user", "student", "staff"]),
});

export type RegisterType = z.infer<typeof RegisterSchema>;
export class RegisterDto extends createZodDto(RegisterSchema) {}