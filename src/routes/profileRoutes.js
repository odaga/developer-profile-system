const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { validateProfile, validateUpdateProfile } = require('../middleware/validation');

// GET /api/profiles - List profiles with pagination
router.get('/', profileController.getProfiles);

// GET /api/profiles/search - Search profiles
router.get('/search', profileController.searchProfiles);

// GET /api/profiles/:id - Get specific profile
router.get('/:id', profileController.getProfileById);

// POST /api/profiles - Create a developer profile
router.post('/', validateProfile, profileController.createProfile);

// PUT /api/profiles/:id - Update a profile
router.put('/:id', validateUpdateProfile, profileController.updateProfile);

// DELETE /api/profiles/:id - Delete a profile
router.delete('/:id', profileController.deleteProfile);

module.exports = router;