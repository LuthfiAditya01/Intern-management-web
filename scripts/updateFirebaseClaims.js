import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { connectPostgreSQL } from '../libs/postgresql.js';
import { User } from '../models/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const updateFirebaseClaims = async () => {
    try {
        await connectPostgreSQL();
        
        // Ambil semua user dengan role mentor
        const mentors = await User.findAll({ 
            where: { role: 'mentor' } 
        });
        
        console.log(`Found ${mentors.length} mentors in database`);
        
        for (const mentor of mentors) {
            try {
                // Update custom claims di Firebase
                await getAuth().setCustomUserClaims(mentor.firebaseUid, { 
                    role: 'mentor',
                    user_id: mentor.id 
                });
                
                console.log(`✅ Updated Firebase claims for ${mentor.email} (${mentor.firebaseUid})`);
            } catch (error) {
                console.error(`❌ Error updating ${mentor.email}:`, error.message);
            }
        }
        
        // Cek juga user admin
        const admins = await User.findAll({ 
            where: { role: 'admin' } 
        });
        
        console.log(`\nFound ${admins.length} admins in database`);
        
        for (const admin of admins) {
            try {
                await getAuth().setCustomUserClaims(admin.firebaseUid, { 
                    role: 'admin',
                    user_id: admin.id 
                });
                
                console.log(`✅ Updated Firebase claims for ${admin.email} (${admin.firebaseUid})`);
            } catch (error) {
                console.error(`❌ Error updating ${admin.email}:`, error.message);
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
};

updateFirebaseClaims(); 