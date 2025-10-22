const Profile = require('../models/Profile');

const sampleProfiles = [
  {
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    experienceYears: 5,
    availableForWork: true,
    hourlyRate: 85
  },
  {
    name: "Bob Smith",
    email: "bob.smith@email.com",
    location: "New York, NY",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    experienceYears: 7,
    availableForWork: false,
    hourlyRate: 95
  },
  {
    name: "Carol Davis",
    email: "carol.davis@email.com",
    location: "Austin, TX",
    skills: ["JavaScript", "Vue.js", "Express", "MySQL"],
    experienceYears: 3,
    availableForWork: true,
    hourlyRate: 65
  },
  {
    name: "David Wilson",
    email: "david.wilson@email.com",
    location: "Seattle, WA",
    skills: ["Java", "Spring Boot", "React", "Docker"],
    experienceYears: 8,
    availableForWork: true,
    hourlyRate: 105
  },
  {
    name: "Eva Martinez",
    email: "eva.martinez@email.com",
    location: "Miami, FL",
    skills: ["Angular", "C#", ".NET", "SQL Server"],
    experienceYears: 4,
    availableForWork: true,
    hourlyRate: 75
  },
  {
    name: "Frank Brown",
    email: "frank.brown@email.com",
    location: "Chicago, IL",
    skills: ["PHP", "Laravel", "Vue.js", "Redis"],
    experienceYears: 6,
    availableForWork: false,
    hourlyRate: 80
  },
  {
    name: "Grace Lee",
    email: "grace.lee@email.com",
    location: "Boston, MA",
    skills: ["React Native", "Firebase", "GraphQL", "JavaScript"],
    experienceYears: 4,
    availableForWork: true,
    hourlyRate: 90
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with sample profiles...');
    
    // Check if profiles already exist
    const existingCount = await Profile.count();
    if (existingCount > 0) {
      console.log(`✅ Database already contains ${existingCount} profiles`);
      return {
        success: true,
        message: `Database already contains ${existingCount} profiles`,
        count: existingCount
      };
    }
    
    // Create sample profiles
    for (const profileData of sampleProfiles) {
      await Profile.create(profileData);
    }
    
    console.log(`✅ Successfully seeded ${sampleProfiles.length} profiles`);
    
    // Get database stats
    const database = require('../config/database');
    const stats = await database.getStats();
    console.log('📊 Database stats:', stats);
    
    return {
      success: true,
      message: `Successfully seeded ${sampleProfiles.length} profiles`,
      count: sampleProfiles.length,
      stats: stats
    };
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    return {
      success: false,
      message: error.message
    };
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(result => {
      if (result.success) {
        console.log('🎉 Seeding completed successfully');
        process.exit(0);
      } else {
        console.error('💥 Seeding failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Seeding error:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;
