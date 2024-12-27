import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";


export const BookSchema = z.object({
    id: z.string(),
    title: z.string(),
    author: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.enum(['Adventure', 'Fantasy', 'Crime', 'Self-Help', 'Fiction']),
    count:z.number().optional(),
});


// export const CreateBookSchema = BookSchema.omit({ id: true });
// export const UpdateBookSchema = BookSchema.omit({ id: true }).partial();
export class CreateBookDto extends createZodDto(BookSchema.omit({ id: true })) {}
export class UpdateBookDto extends createZodDto(BookSchema.omit({ id: true }).partial()) {}
export type Book = z.infer<typeof BookSchema>;
