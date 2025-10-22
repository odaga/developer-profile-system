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