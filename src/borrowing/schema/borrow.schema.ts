import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";    

export const BorrowingSchema = z.object({
    id: z.string(),
    bookId: z.string(),
    userId: z.string(),
    title: z.string(),
    borrowDate: z.date(),
    returnDate: z.date(),
    count: z.number(),
});

export class BorrowingDto extends createZodDto(BorrowingSchema.omit({ id: true }).partial()) {}
export type Borrowing = z.infer<typeof BorrowingSchema>;