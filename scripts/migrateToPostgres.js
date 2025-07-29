import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectPostgreSQL } from '../libs/postgresql.js';
import { User, Mentor, Intern, Assessment, Quota } from '../models/index.js';

// Load environment variables
dotenv.config();

// Import model MongoDB lama
import InternInfo from '../models/internInfo.js';
import MentorInfo from '../models/mentorInfo.js';
import InternAssessment from '../models/internAssesment.js';

console.log("Script started");

const migrateData = async () => {
  try {
    console.log("Starting migration process...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");
    
    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined");
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Connect to PostgreSQL
    console.log("Connecting to PostgreSQL...");
    await connectPostgreSQL();
    console.log("Connected to PostgreSQL");

    console.log("Starting data migration...");

    // Migrate Users (create from existing data)
    console.log("Migrating users...");
    const interns = await InternInfo.find({});
    console.log(`Found ${interns.length} interns in MongoDB`);
    
    const mentors = await MentorInfo.find({});
    console.log(`Found ${mentors.length} mentors in MongoDB`);

    // Create users for interns
    console.log("Creating users for interns...");
    for (const intern of interns) {
      try {
        await User.create({
          username: intern.email.split('@')[0],
          email: intern.email,
          password: 'defaultpassword123', // Set default password
          role: 'intern',
        });
        console.log(`Created user for intern: ${intern.email}`);
      } catch (error) {
        console.log(`Error creating user for intern ${intern.email}:`, error.message);
      }
    }

    // Create users for mentors
    console.log("Creating users for mentors...");
    for (const mentor of mentors) {
      try {
        await User.create({
          username: mentor.email.split('@')[0],
          email: mentor.email,
          password: 'defaultpassword123', // Set default password
          role: 'mentor',
        });
        console.log(`Created user for mentor: ${mentor.email}`);
      } catch (error) {
        console.log(`Error creating user for mentor ${mentor.email}:`, error.message);
      }
    }

    // Migrate Mentors
    console.log("Migrating mentors...");
    for (const mentorData of mentors) {
      try {
        const user = await User.findOne({ where: { email: mentorData.email } });
        if (user) {
          await Mentor.create({
            userId: user.id,
            nama: mentorData.nama,
            nip: mentorData.nip,
            email: mentorData.email,
            divisi: mentorData.divisi,
            status: mentorData.status,
          });
          console.log(`Migrated mentor: ${mentorData.nama}`);
        }
      } catch (error) {
        console.log(`Error migrating mentor ${mentorData.nama}:`, error.message);
      }
    }

    // Migrate Interns
    console.log("Migrating interns...");
    for (const internData of interns) {
      try {
        const user = await User.findOne({ where: { email: internData.email } });
        if (user) {
          await Intern.create({
            userId: user.id,
            email: internData.email,
            nama: internData.nama,
            nim: internData.nim,
            nik: internData.nik,
            prodi: internData.prodi,
            kampus: internData.kampus,
            tanggalMulai: internData.tanggalMulai,
            tanggalSelesai: internData.tanggalSelesai,
            divisi: internData.divisi,
            status: internData.status,
            // Note: pembimbing relationship will need manual mapping
          });
          console.log(`Migrated intern: ${internData.nama}`);
        }
      } catch (error) {
        console.log(`Error migrating intern ${internData.nama}:`, error.message);
      }
    }

    // Migrate Assessments
    console.log("Migrating assessments...");
    const assessments = await InternAssessment.find({});
    console.log(`Found ${assessments.length} assessments in MongoDB`);
    
    for (const assessmentData of assessments) {
      try {
        // Find the intern by email (assuming email is unique)
        const intern = await Intern.findOne({
          include: [{
            model: User,
            as: 'user',
            where: { email: assessmentData.internId } // This might need adjustment based on your data structure
          }]
        });

        if (intern) {
          await Assessment.create({
            internId: intern.id,
            komunikasi: assessmentData.aspekNilai.komunikasi,
            kerjaTim: assessmentData.aspekNilai.kerjaTim,
            kedisiplinan: assessmentData.aspekNilai.kedisiplinan,
            inisiatif: assessmentData.aspekNilai.inisiatif,
            tanggungJawab: assessmentData.aspekNilai.tanggungJawab,
            catatan: assessmentData.aspekNilai.catatan,
            penilai: assessmentData.penilai,
            tanggalDinilai: assessmentData.tanggalDinilai,
          });
          console.log(`Migrated assessment for intern: ${intern.nama}`);
        }
      } catch (error) {
        console.log(`Error migrating assessment:`, error.message);
      }
    }

    // Skip Quota migration since the model is commented out
    console.log("Skipping quota migration (model is commented out)");

    console.log("Migration completed successfully!");
    
    // Disconnect from databases
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

console.log("About to run migration");
migrateData().then(() => {
  console.log("Migration finished");
}).catch((error) => {
  console.error("Migration error:", error);
}); 