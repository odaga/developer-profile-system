const Profile = require('../models/Profile');

// @desc    Get all profiles with pagination
// @route   GET /api/profiles
// @access  Public
const getProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Profile.findAllProfiles(page, limit);

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profiles'
    });
  }
};

// @desc    Get single profile
// @route   GET /api/profiles/:id
// @access  Public
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(parseInt(req.params.id));
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Create profile
// @route   POST /api/profiles
// @access  Public
const createProfile = async (req, res) => {
  try {
    // Check if email already exists
    const existingProfile = await Profile.findByEmail(req.body.email);
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile with this email already exists'
      });
    }

    const profile = await Profile.createProfile(req.body);
    
    res.status(201).json({
      success: true,
      data: profile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating profile'
    });
  }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Public
const updateProfile = async (req, res) => {
  try {
    // Check if profile exists
    const existingProfile = await Profile.findById(parseInt(req.params.id));
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Check if email is being changed to an existing one
    if (req.body.email && req.body.email !== existingProfile.email) {
      const emailExists = await Profile.findByEmail(req.body.email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Profile with this email already exists'
        });
      }
    }

    const updatedProfile = await Profile.updateProfile(parseInt(req.params.id), req.body);
    
    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Public
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(parseInt(req.params.id));
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    await Profile.deleteProfile(parseInt(req.params.id));
    
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting profile'
    });
  }
};

// @desc    Search profiles
// @route   GET /api/profiles/search
// @access  Public
const searchProfiles = async (req, res) => {
  try {
    const { skills, location, availableForWork, minExperience, maxHourlyRate, page = 1, limit = 10 } = req.query;
    
    let searchQuery = {};
    if (skills) searchQuery.skills = skills;
    if (location) searchQuery.location = location;
    if (availableForWork !== undefined) searchQuery.availableForWork = availableForWork;
    if (minExperience) searchQuery.minExperience = minExperience;
    if (maxHourlyRate) searchQuery.maxHourlyRate = maxHourlyRate;

    const result = await Profile.searchProfiles(searchQuery, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      searchQuery
    });
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching profiles'
    });
  }
};

module.exports = {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  searchProfiles
};