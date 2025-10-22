const Joi = require('joi');

const profileSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name must be less than 100 characters long'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required'
  }),
  location: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Location is required',
    'string.min': 'Location must be at least 2 characters long'
  }),
  skills: Joi.array().items(Joi.string().min(1)).min(1).required().messages({
    'array.min': 'At least one skill is required',
    'array.base': 'Skills must be an array of strings'
  }),
  experienceYears: Joi.number().min(0).max(50).required().messages({
    'number.base': 'Experience years must be a number',
    'number.min': 'Experience years cannot be negative',
    'number.max': 'Experience years cannot exceed 50'
  }),
  availableForWork: Joi.boolean().default(true),
  hourlyRate: Joi.number().min(0).max(1000).required().messages({
    'number.base': 'Hourly rate must be a number',
    'number.min': 'Hourly rate cannot be negative',
    'number.max': 'Hourly rate cannot exceed $1000'
  })
});

const validateProfile = (req, res, next) => {
  const { error } = profileSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

const validateUpdateProfile = (req, res, next) => {
  const updateSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    location: Joi.string().min(2).max(100),
    skills: Joi.array().items(Joi.string().min(1)).min(1),
    experienceYears: Joi.number().min(0).max(50),
    availableForWork: Joi.boolean(),
    hourlyRate: Joi.number().min(0).max(1000)
  }).min(1);

  const { error } = updateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

module.exports = {
  validateProfile,
  validateUpdateProfile
};