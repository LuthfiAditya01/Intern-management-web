import User from './User.js';
import Mentor from './Mentor.js';
import Intern from './Intern.js';
import Assessment from './Assessment.js';
import Quota from './Quota.js';
import Izin from './Izin.js';
import DaftarHadir from './DaftarHadir.js';
import GeoFencing from './GeoFencing.js';
import Sertifikat from './Sertifikat.js';
import SertifikatTemplate from './SertifikatTemplate.js';

// User Associations
User.hasOne(Intern, { foreignKey: 'userId', as: 'intern' });
User.hasOne(Mentor, { foreignKey: 'userId', as: 'mentorProfile' });
User.hasMany(Izin, { foreignKey: 'userId', as: 'izins' });
User.hasMany(DaftarHadir, { foreignKey: 'userId', as: 'daftarHadir' });
User.hasMany(Assessment, { foreignKey: 'userId', as: 'userAssessments' });
User.hasMany(Sertifikat, { foreignKey: 'userId', as: 'sertifikats' });

// Intern Associations
Intern.belongsTo(User, { foreignKey: 'userId', as: 'internUser' });
Intern.belongsTo(Mentor, { foreignKey: 'mentorId', as: 'pembimbing' }); // PERBAIKAN: Ubah alias dari 'mentor' ke 'pembimbing'
Intern.hasMany(Assessment, { foreignKey: 'internId', as: 'internAssessments' });

// Mentor Associations
Mentor.belongsTo(User, { foreignKey: 'userId', as: 'mentorUser' });
Mentor.hasMany(Intern, { foreignKey: 'mentorId', as: 'mentoredInterns' });

// Izin Associations
Izin.belongsTo(User, { foreignKey: 'userId', as: 'izinUser' });

// DaftarHadir Associations
DaftarHadir.belongsTo(User, { foreignKey: 'userId', as: 'absenUser' });

// Assessment Associations
Assessment.belongsTo(User, { foreignKey: 'userId', as: 'assessmentUser' });
Assessment.belongsTo(Intern, { foreignKey: 'internId', as: 'assessmentIntern' });

// Sertifikat Associations
Sertifikat.belongsTo(User, { foreignKey: 'userId', as: 'sertifikatUser' });
Sertifikat.belongsTo(SertifikatTemplate, { foreignKey: 'templateId', as: 'template' });

// SertifikatTemplate Associations
SertifikatTemplate.hasMany(Sertifikat, { foreignKey: 'templateId', as: 'sertifikats' });

console.log('✅ All associations defined successfully');

export {
  User,
  Mentor,
  Intern,
  Assessment,
  Quota,
  Izin,
  DaftarHadir,
  GeoFencing,
  Sertifikat,
  SertifikatTemplate,
}; 