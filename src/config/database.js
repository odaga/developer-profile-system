const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

class Database {
  constructor() {
    this.sequelize = sequelize;
    this.isConnected = false;
  }

  async connect() {
    try {
      await this.sequelize.authenticate();
      this.isConnected = true;
      console.log('✅ SQLite database connected successfully');
      
      // Sync all models
      await this.syncModels();
      return this;
    } catch (error) {
      console.error('❌ Unable to connect to SQLite database:', error);
      throw error;
    }
  }

  async syncModels() {
    try {
      // Import models
      const Profile = require('../models/Profile');
      
      // Sync models with database
      await Profile.sync({ force: false }); // Set force: true to reset database
      console.log('✅ Database models synchronized');
    } catch (error) {
      console.error('❌ Error syncing database models:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.sequelize.close();
      this.isConnected = false;
      console.log('Database disconnected');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      type: 'SQLite',
      database: 'database.sqlite',
      dialect: this.sequelize.getDialect()
    };
  }

  // Method to get database statistics
  async getStats() {
    try {
      const Profile = require('../models/Profile');
      const totalProfiles = await Profile.count();
      const availableProfiles = await Profile.count({ where: { availableForWork: true } });
      
      const experienceStats = await Profile.findOne({
        attributes: [
          [this.sequelize.fn('AVG', this.sequelize.col('experienceYears')), 'avgExperience'],
          [this.sequelize.fn('MAX', this.sequelize.col('experienceYears')), 'maxExperience'],
          [this.sequelize.fn('MIN', this.sequelize.col('experienceYears')), 'minExperience']
        ]
      });

      const rateStats = await Profile.findOne({
        attributes: [
          [this.sequelize.fn('AVG', this.sequelize.col('hourlyRate')), 'avgRate'],
          [this.sequelize.fn('MAX', this.sequelize.col('hourlyRate')), 'maxRate'],
          [this.sequelize.fn('MIN', this.sequelize.col('hourlyRate')), 'minRate']
        ]
      });

      return {
        totalProfiles,
        availableProfiles,
        unavailableProfiles: totalProfiles - availableProfiles,
        averageExperience: parseFloat(experienceStats.get('avgExperience') || 0).toFixed(1),
        averageRate: parseFloat(rateStats.get('avgRate') || 0).toFixed(2),
        maxExperience: experienceStats.get('maxExperience') || 0,
        maxRate: rateStats.get('maxRate') || 0
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return {};
    }
  }
}

// Create and export a singleton instance
const database = new Database();

module.exports = database;













// /**
//  * Database Configuration
//  * Currently using in-memory storage
//  * Can be extended to support MongoDB, PostgreSQL, etc.
//  */

// class Database {
//   constructor() {
//     this.isConnected = true; // For in-memory storage, we're always "connected"
//     this.connectionString = 'in-memory';
//   }

//   async connect() {
//     try {
//       console.log('📁 Using in-memory database storage');
//       console.log('💡 Tip: To use MongoDB, install mongoose and update this configuration');
//       this.isConnected = true;
//       return this;
//     } catch (error) {
//       console.error('Database connection error:', error);
//       throw error;
//     }
//   }

//   async disconnect() {
//     this.isConnected = false;
//     console.log('Database disconnected');
//   }

//   getStatus() {
//     return {
//       connected: this.isConnected,
//       type: 'in-memory',
//       connection: this.connectionString
//     };
//   }

//   // Method to clear all data (useful for testing)
//   clear() {
//     const Profile = require('../models/Profile');
//     const profiles = Profile.findAll();
//     profiles.length = 0; // Clear the array
//     console.log('Database cleared');
//   }

//   // Method to get database statistics
//   getStats() {
//     const Profile = require('../models/Profile');
//     const profiles = Profile.findAll();
    
//     return {
//       totalProfiles: profiles.length,
//       availableProfiles: profiles.filter(p => p.availableForWork).length,
//       averageExperience: profiles.reduce((acc, p) => acc + p.experienceYears, 0) / profiles.length || 0,
//       averageHourlyRate: profiles.reduce((acc, p) => acc + p.hourlyRate, 0) / profiles.length || 0,
//       topSkills: this.getTopSkills(profiles)
//     };
//   }

//   getTopSkills(profiles, limit = 5) {
//     const skillCount = {};
    
//     profiles.forEach(profile => {
//       profile.skills.forEach(skill => {
//         skillCount[skill] = (skillCount[skill] || 0) + 1;
//       });
//     });

//     return Object.entries(skillCount)
//       .sort(([,a], [,b]) => b - a)
//       .slice(0, limit)
//       .map(([skill, count]) => ({ skill, count }));
//   }
// }

// // Create and export a singleton instance
// const database = new Database();

// module.exports = database;