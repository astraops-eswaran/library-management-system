import mongoose from "mongoose";


export const BorrowingSchema = new mongoose.Schema({
    id: String,
    bookId: String,
    userId: String,
    title: String,
    borrowDate: { type: Date, default: new Date() },
    returnDate: { type: Date, default: () => {
        const date = new Date(new Date());
        date.setDate(date.getDate() + 7); // adds 7days
        return date;
    }},
});