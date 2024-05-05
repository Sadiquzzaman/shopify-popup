import Joi from "joi";
import objectId from "./custom.validation.js";

export const popupEntitySchema = Joi.object({
  name: Joi.string(),
  template_id: Joi.string(),
  shop: Joi.string().required(),
  popupType: Joi.string().valid("text", "form", "image").default("text"),
  popupStatus: Joi.string().valid("published", "draft").default("draft"),
  activeStatus: Joi.string().valid("active", "inactive").default("inactive"),
});

export const updatePopUp = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      background: Joi.object().keys({
        color: Joi.string().hex(),
      }),
      headingField: Joi.object().keys({
        textAlignment: Joi.string(),
        textContent: Joi.string(),
        fontColor: Joi.string().hex(),
        fontFamily: Joi.string(),
        fontSize: Joi.string(),
      }),
      inputFieldLabel01: Joi.object().keys({
        textAlignment: Joi.string(),
        textContent: Joi.string(),
        fontColor: Joi.string().hex(),
        fontFamily: Joi.string(),
        fontSize: Joi.string(),
      }),
      inputFieldLabel02: Joi.object().keys({
        textAlignment: Joi.string(),
        textContent: Joi.string(),
        fontColor: Joi.string().hex(),
        fontFamily: Joi.string(),
        fontSize: Joi.string(),
      }),
      submitButtonField: Joi.object().keys({
        textAlignment: Joi.string(),
        textContent: Joi.string(),
        fontColor: Joi.string().hex(),
        fontFamily: Joi.string(),
        fontSize: Joi.string(),
      }),
      template_id: Joi.string(),
      shop: Joi.string(),
      image_type: Joi.string().valid("background_image", "logo_image"),
      image: Joi.any(),
      popupType: Joi.string().valid("text", "form", "image").default("text"),
      activeStatus: Joi.string()
        .valid("active", "inactive","draft")
        .default("inactive"),
      rules: Joi.array().items(
        Joi.object().keys({
          configurationId: Joi.string(),
          value: Joi.number(),
          description: Joi.string(),
          status: Joi.string().valid("Active", "Inactive"),
        })
      ),
    })
    .optional(),
};


export const deletePopUps = {
  body: Joi.object({
    popupIds: Joi.array().items(Joi.string().custom(objectId)),
  }),
};
