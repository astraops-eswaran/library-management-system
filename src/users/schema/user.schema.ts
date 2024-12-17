import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";


export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  password: z.string().min(8),
  role: z.enum(["admin", "user"]),
});

export class CreateUserDto extends createZodDto(UserSchema.omit({ id: true })) {}
export class UpdateUserDto extends createZodDto(UserSchema.omit({ id: true }).partial()) {}


export type User = z.infer<typeof UserSchema>;
