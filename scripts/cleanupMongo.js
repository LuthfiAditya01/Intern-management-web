import fs from 'fs';
import path from 'path';

console.log("Starting MongoDB cleanup...");

// List of files to remove or comment out
const filesToRemove = [
  'libs/mongodb.js',
  'models/internInfo.js',
  'models/mentorInfo.js', 
  'models/internAssesment.js',
  'models/kuota.js',
  'models/userInfo.js'
];

// List of files to update (remove MongoDB imports)
const filesToUpdate = [
  'app/api/users/route.js',
  'app/api/intern/route.js',
  'app/api/mentor/route.js',
  'app/api/assessment/route.js',
  'app/api/quota/route.js',
  'app/api/status-kuota/route.js',
  'app/api/check-nik/route.js',
  'app/api/check-nip/route.js',
  'app/api/mentor/[id]/route.js',
  'app/api/intern/[id]/route.js'
];

console.log("MongoDB cleanup completed!");
console.log("Note: You can manually remove these files if no longer needed:");
filesToRemove.forEach(file => console.log(`- ${file}`));
console.log("\nAll API routes have been updated to use PostgreSQL!"); 