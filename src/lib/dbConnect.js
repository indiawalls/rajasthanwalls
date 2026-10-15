import dns from "node:dns";
import mongoose from "mongoose";

// Resolve MongoDB Atlas SRV records via reliable public DNS in development only
try {
    if (process.env.NODE_ENV !== 'production') {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    }
} catch (e) {
    // Ignore in non-Node or restricted environments
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }
    // 1. If connection is cached, return it
    if (cached.conn) {
        return cached.conn;
    }

    // 2. If no promise exists, create a new one to connect
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    // 3. Await the promise and store the active connection
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Reset promise on error so retry is possible
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
