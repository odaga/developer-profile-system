const Profile = require("../models/Profile");

/**
 * Helper function for consistent error responses.
 * @param {object} res - Express response object.
 * @param {number} status - HTTP status code.
 * @param {string} msg - Error message.
 * @param {Error} [err] - Optional error object for logging.
 */
const sendError = (res, status, msg, err) => {
  if (err) {
    // Log the full error, but send a simpler message to the client
    console.error(`Controller Error [${status}]: ${msg}`, err.message || err);
  } else {
    console.warn(`Controller Warning [${status}]: ${msg}`);
  }

  res.status(status).json({
    message: msg,
  });
};

// --- Read Operations ---

// GET /api/profiles
// Lists all profiles with basic pagination.
const getProfiles = async (req, res) => {
  try {
    // Set sensible defaults if queries are missing
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);

    const { data, pagination } = await Profile.findAllProfiles(page, limit);

    res.json({ data, pagination });
  } catch (error) {
    sendError(res, 500, "Failed to fetch profiles.", error);
  }
};

// GET /api/profiles/:id
// Gets a single profile by ID.
const getProfileById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const profile = await Profile.findById(id);

    if (!profile) {
      return sendError(res, 404, `Profile with ID ${id} not found.`);
    }

    res.json({ data: profile });
  } catch (error) {
    sendError(res, 500, "Failed to retrieve profile.", error);
  }
};

// GET /api/profiles/search
// Handles complex filtering and searching.
const searchProfiles = async (req, res) => {
  try {
    const {
      skills,
      location,
      availableForWork,
      minExperience,
      maxHourlyRate,
      page = 1,
      limit = 10,
    } = req.query;

    // Build the query object only with provided values
    const searchQuery = {
      ...(skills && { skills }),
      ...(location && { location }),
      ...(availableForWork !== undefined && { availableForWork }),
      ...(minExperience && { minExperience }),
      ...(maxHourlyRate && { maxHourlyRate }),
    };

    const { data, pagination } = await Profile.searchProfiles(
      searchQuery,
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      data,
      pagination,
      criteria: searchQuery, // Send back the criteria for client feedback
    });
  } catch (error) {
    sendError(res, 500, "Failed to execute search.", error);
  }
};

// --- Write Operations ---
// POST /api/profiles
// Creates a new profile.
const createProfile = async (req, res) => {
  try {
    // Quick check: has this email been used?
    if (await Profile.findByEmail(req.body.email)) {
      return sendError(res, 409, "A profile with this email already exists.");
    }

    const profile = await Profile.createProfile(req.body);

    // Status 201 for Resource Created
    res.status(201).json({
      data: profile,
      message: "Profile created successfully!",
    });
  } catch (error) {
    sendError(res, 500, "Could not create the profile.", error);
  }
};

// PUT /api/profiles/:id
// Updates an existing profile.
const updateProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const existingProfile = await Profile.findById(id);

    if (!existingProfile) {
      return sendError(res, 404, `Profile with ID ${id} not found for update.`);
    }

    // Check for email collision only if the email is being changed
    if (req.body.email && req.body.email !== existingProfile.email) {
      if (await Profile.findByEmail(req.body.email)) {
        return sendError(
          res,
          409,
          "Cannot use this email; it belongs to another profile."
        );
      }
    }

    const updatedProfile = await Profile.updateProfile(id, req.body);

    res.json({
      data: updatedProfile,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    sendError(res, 500, `Failed to update profile ID ${id}.`, error);
  }
};

// DELETE /api/profiles/:id
// Removes a profile.
const deleteProfile = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    if (!(await Profile.findById(id))) {
      return sendError(
        res,
        404,
        `Profile ID ${id} is already gone or never existed.`
      );
    }

    await Profile.deleteProfile(id);

    // Send a 204 No Content for a successful deletion, or a 200 with a message
    res.status(200).json({
      message: `Profile ID ${id} deleted successfully.`,
    });
  } catch (error) {
    sendError(res, 500, `Failed to delete profile ID ${id}.`, error);
  }
};

module.exports = {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  searchProfiles,
};
