import *as mongoose from "mongoose";


export const UserSchema = new mongoose.Schema({
    username: String,
    emailId: String,
    password: String,
    role: String,
});