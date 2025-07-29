import dotenv from 'dotenv';
import { connectPostgreSQL } from '../libs/postgresql.js';
import { User, Mentor, Intern, Assessment, Quota } from '../models/index.js';

// Load environment variables
dotenv.config();

console.log("Script started");

const setupPostgres = async () => {
  try {
    console.log("Starting PostgreSQL setup...");
    
    // Connect to PostgreSQL
    console.log("Connecting to PostgreSQL...");
    await connectPostgreSQL();
    console.log("Connected to PostgreSQL");

    console.log("Database setup completed successfully!");
    console.log("Tables created:");
    console.log("- Users");
    console.log("- Mentors");
    console.log("- Interns");
    console.log("- Assessments");
    console.log("- Quotas");

  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
};

console.log("About to run setup");
setupPostgres().then(() => {
  console.log("Setup finished");
}).catch((error) => {
  console.error("Setup error:", error);
}); 