import Joi from "joi";
import objectId from "./custom.validation.js";

const generateEventValidation = {
  body: Joi.object({
    eventType: Joi.string().required(),
    popUpId: Joi.string().custom(objectId).required(),
  }),
};

export { generateEventValidation };
