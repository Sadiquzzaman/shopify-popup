import Joi from "joi";

export const userSchema = {
  body: Joi.object({
    email: Joi.string().required().email(),
    platformDomainPairs: Joi.array().items(
      Joi.object({
        platform: Joi.string().required(),
        domain: Joi.string().required(),
      })
    ),
  }),
};

export const signUpSchema = {
  body: Joi.object({
    email: Joi.string().required().email()
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const login = {
  body: Joi.object().keys({
    userId: Joi.string(),
    email: Joi.string(),
  }),
};
