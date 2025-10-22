const { DataTypes } = require('sequelize');
const database = require('../config/database');

// Define the Profile model
const Profile = database.sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    }
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 50
    }
  },
  availableForWork: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
      max: 1000
    }
  }
}, {
  tableName: 'profiles',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Static methods for the model
Profile.findAllProfiles = async function(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  const result = await this.findAndCountAll({
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    data: result.rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(result.count / limit),
      totalItems: result.count,
      hasNext: page < Math.ceil(result.count / limit),
      hasPrev: page > 1,
      itemsPerPage: parseInt(limit)
    }
  };
};

Profile.findById = async function(id) {
  return await this.findByPk(id);
};

Profile.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

Profile.createProfile = async function(data) {
  return await this.create(data);
};

Profile.updateProfile = async function(id, data) {
  const profile = await this.findByPk(id);
  if (!profile) return null;
  
  return await profile.update(data);
};

Profile.deleteProfile = async function(id) {
  const profile = await this.findByPk(id);
  if (!profile) return false;
  
  await profile.destroy();
  return true;
};

Profile.searchProfiles = async function(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const whereClause = {};
  
  // Build search conditions
  if (query.location) {
    whereClause.location = { [database.sequelize.Op.like]: `%${query.location}%` };
  }
  
  if (query.availableForWork !== undefined) {
    whereClause.availableForWork = query.availableForWork === 'true';
  }
  
  if (query.minExperience) {
    whereClause.experienceYears = { 
      [database.sequelize.Op.gte]: parseInt(query.minExperience) 
    };
  }
  
  if (query.maxHourlyRate) {
    whereClause.hourlyRate = { 
      [database.sequelize.Op.lte]: parseFloat(query.maxHourlyRate) 
    };
  }

  // Skills search requires custom handling
  let skillWhereClause = {};
  if (query.skills) {
    const searchSkills = Array.isArray(query.skills) ? query.skills : [query.skills];
    skillWhereClause = {
      skills: {
        [database.sequelize.Op.like]: database.sequelize.literal(
          searchSkills.map(skill => `'%"${skill}"%'`).join(' OR skills LIKE ')
        )
      }
    };
  }

  const finalWhere = { ...whereClause, ...skillWhereClause };

  const result = await this.findAndCountAll({
    where: finalWhere,
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    data: result.rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(result.count / limit),
      totalItems: result.count,
      hasNext: page < Math.ceil(result.count / limit),
      hasPrev: page > 1,
      itemsPerPage: parseInt(limit)
    }
  };
};

// Instance methods
Profile.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

module.exports = Profile;