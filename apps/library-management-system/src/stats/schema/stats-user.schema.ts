import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';


export const StatsUserSchema = z.object({
    userId: z.string(),
    totalBorrowedBooks: z.number(),
});

export type StatsUser = z.infer<typeof StatsUserSchema>;
export class StatsUserDto extends createZodDto(StatsUserSchema) {}
export const StatsUserPayload = z.object({
    userId: z.string(),
    totalBorrowedBooks: z.number(),
});


export type StatsUserPayload = z.infer<typeof StatsUserPayload>;
export class StatsUserPayloadDto extends createZodDto(StatsUserPayload) {}