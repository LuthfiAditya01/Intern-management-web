import { connectPostgreSQL } from '../libs/postgresql.js';
import { User } from '../models/index.js';

const checkAndFixUserRoles = async () => {
    try {
        await connectPostgreSQL();
        
        // Cek user bps1871ok@gmail.com
        const user = await User.findOne({ 
            where: { email: 'bps1871ok@gmail.com' } 
        });
        
        if (user) {
            console.log('User ditemukan:', {
                email: user.email,
                role: user.role,
                firebaseUid: user.firebaseUid
            });
            
            // Update role menjadi mentor jika belum
            if (user.role !== 'mentor') {
                await user.update({ role: 'mentor' });
                console.log('Role berhasil diupdate menjadi mentor');
            } else {
                console.log('Role sudah benar (mentor)');
            }
        } else {
            console.log('User bps1871ok@gmail.com tidak ditemukan');
        }
        
        // Cek semua user dengan role mentor
        const mentors = await User.findAll({ 
            where: { role: 'mentor' } 
        });
        
        console.log('\nDaftar semua user dengan role mentor:');
        mentors.forEach(mentor => {
            console.log(`- ${mentor.email} (${mentor.role})`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit(0);
    }
};

checkAndFixUserRoles(); 