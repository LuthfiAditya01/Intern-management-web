import mongoose from "mongoose"

const connectMongoDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }
        
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.error("MongoDB connection error:", error)
        throw error; // Re-throw error untuk ditangkap oleh API route
    }
}

export default connectMongoDB;