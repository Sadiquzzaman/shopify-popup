import Joi from "joi";
import objectId from "./custom.validation.js";

const generateLeads = {
  query: Joi.object().keys({
    shop: Joi.string().required(),
  }),
  body: Joi.object({
    email: Joi.string().required(),
    name: Joi.string(),
    popUpId: Joi.string().custom(objectId).required(),
  }),
};

const getLeadsData = {
  query: Joi.object().keys({
    shop: Joi.string().required(),
    searchTerm: Joi.string(),
  }),
};

const getLeadData = {
  params: Joi.object().keys({
    popUpId: Joi.string().required(),
  }),
  query: Joi.object().keys({
    searchTerm: Joi.string(),
  }),
};



export { generateLeads,getLeadsData,getLeadData };
