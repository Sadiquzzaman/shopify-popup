import httpStatus from "http-status";
import {
  loginUserWithEmail,
  loginUserWithUserId,
} from "../services/auth.service.js";
import { createNewUser, createUser, verifyEmail } from "../services/user.service.js";
import { generateAuthTokens } from "../utils/generate-tokens.js";
import { getShopDetails } from "../utils/shop-data.utils.js";

export const register = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send({ messsage: error });
  }
};

export const signUp = async (req, res) => {
  try {
    const user = await createNewUser(req.body);
    res.status(httpStatus.CREATED).send(user);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send({ messsage: error });
  }
};

export const verifyEmailToken = async (req, res) => {
  try {
    await verifyEmail(req.query.token);
    res
      .status(httpStatus.OK)
      .send({ message: "Email verification successful" });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

export const loginWithUserId = async (req, res) => {
  try {
    let user;
    const { userId } = req.body;
    const { email } = req.body;

    if(userId){
      user = await loginUserWithUserId(userId);
    }

    if(email){
      user = await loginUserWithEmail(email);
    }

    const accessToken = await generateAuthTokens(user);

    const userWithAccessToken = {
      id: user.userId,
      email: user.email,
      accessToken: accessToken,
    };

    res.send(userWithAccessToken);
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ status: 400, messsage: error.message });
  }
};

export const shopifyAuth = async (req, res) => {
  try {
    const encodeUrl = encodeURI(
      `https://${req.query.shop}.myshopify.com/admin/oauth/authorize?client_id=${process.env.client_id}&scope=${process.env.scopes}&redirect_uri=${process.env.redirect_uri}`
    );
    res.status(200).json({ success: true, url: encodeUrl });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

export const shopInfo = async (req, res) => {
  try {
    const shop =req.query.shop
    const token = req.headers["x-shopify-access-token"];

    const shopInfo = await getShopDetails(token,shop)
    res.status(200).json({ success: true, shopInfo });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};
