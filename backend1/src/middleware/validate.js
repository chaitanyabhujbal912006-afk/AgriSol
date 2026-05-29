/**
 * Validation Middleware using Joi
 */
const Joi = require('joi');
const AppError = require('../utils/AppError');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
    });

    if (error) {
      const errors = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message.replace(/['"]/g, ''),
      }));
      const detailedMessage = `Validation failed: ${errors.map(e => e.message).join('. ')}`;
      return next(new AppError(detailedMessage, 422, errors));
    }

    req[property] = value;
    next();
  };
};

module.exports = { validate };
