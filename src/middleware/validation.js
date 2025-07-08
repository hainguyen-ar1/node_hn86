import Joi from 'joi';
import { getSimpRes } from '../const/wrap_response.js';

// Validation schemas
const userValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  gender: Joi.string().valid('male', 'female').required(),
  image: Joi.string().uri().optional()
});

const productValidationSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).min(1).required(),
  stocck: Joi.number().integer().min(0).required()
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Validation middleware
export const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json(getSimpRes({
      status: 'error',
      message: error.details[0].message
    }));
  }
  next();
};

export const validateProduct = (req, res, next) => {
  const { error } = productValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json(getSimpRes({
      status: 'error',
      message: error.details[0].message
    }));
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json(getSimpRes({
      status: 'error',
      message: error.details[0].message
    }));
  }
  next();
}; 