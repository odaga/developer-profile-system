const express = require('express');
const router = express.Router();

// Get the main controller functions
const profiles = require('./../controllers/profileController');

const { validateProfile: validateCreation, validateUpdateProfile: validateUpdate } = require('./../middleware/validation');


// --- Public/Read Routes ---

// GET /api/profiles
// List all profiles
router.get('/', profiles.getProfiles);

// GET /api/profiles/search
// Dedicated route for complex text/field searches.
router.get('/search', profiles.searchProfiles);

// GET /api/profiles/:id
// Fetch a single profile by its unique ID.
router.get('/:id', profiles.getProfileById);


// --- Protected/Write Routes ---
// POST /api/profiles
// Create a new profile (run validation first).
router.post('/', validateCreation, profiles.createProfile);

// PUT /api/profiles/:id
// Update an existing profile (run validation first).
router.put('/:id', validateUpdate, profiles.updateProfile);

// DELETE /api/profiles/:id
// Remove a profile by ID.
router.delete('/:id', profiles.deleteProfile);


module.exports = router;
