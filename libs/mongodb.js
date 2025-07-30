// import { MongoClient } from "mongodb";

// const connectMongoDB = async () => {
//     try {
//         if (!process.env.MONGO_URI) {
//             throw new Error("MONGO_URI environment variable is not defined");
//         }
//         const client = new MongoClient(process.env.MONGO_URI, {
//             useUnifiedTopology: true,
//             useNewUrlParser: true,
//         });
//         await client.connect();
//         console.log("Connected to MongoDB");
//         return client;
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//         throw error; // Re-throw error untuk ditangkap oleh API route
//     }
// };

// export default connectMongoDB;