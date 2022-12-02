import mongoose from 'mongoose';
const { Schema } = mongoose;

export const userSchema = new Schema({
    email: {
        type: String,
        requred: true,
    },
    password: {
        type: String,
        requred: true,
    },
    userName: {
        type: String,
        requred: false,
    }
})

