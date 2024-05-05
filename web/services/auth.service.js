import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import moment from "moment";
import ApiError from "../utils/ApiError.js";
import { getUserByUserEmail, getUserByUserId } from "./user.service.js";

export const loginUserWithUserId = async (userId) => {
  try {
    const user = await getUserByUserId(userId);

  if (!user) {
    throw new ApiError("User not found");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please verify your email");
  }

  return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

export const loginUserWithEmail = async (email) => {
  try {
    const user = await getUserByUserEmail(email);

  if (!user) {
    throw new ApiError("User not found");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please verify your email");
  }

  return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

export const generateToken = async (userId, secret = process.env.JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
  };
  
  const token = jwt.sign(payload, secret);
  return token;
};

export const generateAuthTokens = async (user) => {
  try {
    const accessToken = await generateToken(user.email);
    return accessToken;
  } catch (error) {
    console.error("Error generating auth tokens:", error);
  } 
};