import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI");
}
if (!process.env.MONGODB_DB) {
  throw new Error("❌ Missing MONGODB_DB");
}

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected:", mongoose.connection.host);
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
