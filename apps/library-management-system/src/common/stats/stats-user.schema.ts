import { Schema } from 'mongoose';


export const StatsUserSchema = new Schema({
    userId: { type: String, required: true },
    totalBorrowedBooks: { type: Number, required: true },
});

