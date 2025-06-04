import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
    catched = global.mongoose = { conn: null, promose: null};
}

export async function connectToDatabase() {
    if (catched.conn) return catched.conn;
}

if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((mongoose) => mongoose);

    cached.conn = await catched.promise;
    return cached.conn;
}