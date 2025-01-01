import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";


export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  emailId: z.string().email(),
  password: z.string().min(8),
  createdBy: z.any(),
  role: z.enum(["admin", "user", "student", "staff"]),
});

export class CreateUserDto extends createZodDto(UserSchema.omit({ id: true })) {}
export class UpdateUserDto extends createZodDto(UserSchema.omit({ id: true }).partial()) {}


export type User = z.infer<typeof UserSchema>;
