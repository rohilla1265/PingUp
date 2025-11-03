import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is required");
    }

    const connectionOptions = {
      dbName: "PingUp",
      maxPoolSize: 10, // Maximum number of sockets in the connection pool
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    mongoose.connection.on('connected', () => {
      console.log(`✅ MongoDB connected to database: ${mongoose.connection.db.databaseName}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log("🔌 MongoDB disconnected");
    });

    console.log("🚀 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL, connectionOptions);
    
  } catch (error) {
    console.error("💥 MongoDB connection failed:", error.message);
    // In production, you might want to use a more sophisticated retry mechanism
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

export default connectDB;