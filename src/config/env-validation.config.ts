import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // Required
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  COOKIE_KEY: Joi.string().required(),
  DATABASE_URL: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});