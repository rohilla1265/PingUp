import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is required");
    }

    const connectionOptions = {
      dbName: "PingUp",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // ADD THESE SSL/TLS OPTIONS:
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      retryWrites: true,
      w: 'majority'
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
    
    // Don't retry immediately for SSL errors - it's likely a configuration issue
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error("🔧 SSL/TLS configuration error. Check your connection string and options.");
      process.exit(1); // Exit and fix the configuration
    } else {
      setTimeout(connectDB, 5000); // Retry after 5 seconds for other errors
    }
  }
};

export default connectDB;