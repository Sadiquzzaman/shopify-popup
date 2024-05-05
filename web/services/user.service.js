import dotenv from "dotenv";
import { sendVerificationEmail } from "./email.service.js";
import { connectToDatabase } from "../database/mongodb.js";
import httpStatus from "http-status";
import {mergeUnique} from "../utils/merge-Unique.js"

dotenv.config();
export const createUser = async (userBody) => {
  let client;

  try {
    client = await connectToDatabase();
    const db = client.db("shopify-popup");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ email: userBody.email });

    if (existingUser) {
      userBody.platformDomainPairs = await mergeUnique(
        existingUser.platformDomainPairs || [],
        userBody.platformDomainPairs || [],
        'platform'
      );

      await collection.updateOne(
        { email: userBody.email },
        {
          $set: {
            platformDomainPairs: userBody.platformDomainPairs,
          },
        }
      );
    } else if (!existingUser && userBody.email) {
      const { token, expiresAt } = await generateVerifyEmailToken();
      userBody.verificationToken = token;
      userBody.verificationTokenExpiresAt = expiresAt;
      userBody.isEmailVerified = false;
      userBody.userId = await generateUniqueNumber();

      await sendVerificationEmail(userBody.email, token, expiresAt);
      const result = await collection.insertOne(userBody);
    }


    return userBody;
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
};


export const createNewUser = async (userBody) => {
  let client;

  try {
    client = await connectToDatabase();
    const db = client.db("shopify-popup");
    const collection = db.collection("users");

    const existingUser = await collection.findOne({ email: userBody.email });

    if (existingUser) {
      return {message: "User already exists. Please Login"};
    }

    const { token, expiresAt } = await generateVerifyEmailToken();
    userBody.verificationToken = token;
    userBody.verificationTokenExpiresAt = expiresAt;
    userBody.isEmailVerified = false;
    userBody.userId = await generateUniqueNumber();

    await sendVerificationEmail(userBody.email, token, expiresAt);
    const result = await collection.insertOne(userBody);

    return userBody;
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const generateVerifyEmailToken = async () => {
  const timestamp = new Date().getTime().toString(16).slice(-8);
  const randomToken = (Math.random() * 0xfffff * 1000000)
    .toString(16)
    .slice(0, 12);

  const verificationToken = timestamp + randomToken;

  const expirationTime = new Date();
  expirationTime.setMinutes(
    expirationTime.getMinutes() +
      process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION_MINUTES
  );

  return { token: verificationToken, expiresAt: expirationTime };
};

export const generateUniqueNumber = async () => {
  const timestamp = new Date().getTime().toString();
  const randomSuffix = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, "0");

  const uniqueNumber = timestamp + randomSuffix;

  return uniqueNumber.substr(0, 10);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
export const getUserByUserId = async (id) => {
  let client;

  try {
    client = await connectToDatabase();
    const db = client.db("shopify-popup");
    const collection = db.collection("users");

    const user = await collection.findOne({ userId: id });

    if (!user) {
      throw new Error(httpStatus.NOT_FOUND, "User Not Found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error(httpStatus.BAD_REQUEST, "Error fetching user by ID");
  } finally {
    if (client) {
      await client.close();
    }
  }
};


/**
 * Get user by id
 * @param {String} email
 * @returns {Promise<User>}
 */
export const getUserByUserEmail = async (email) => {
  let client;

  try {
    client = await connectToDatabase();
    const db = client.db("shopify-popup");
    const collection = db.collection("users");

    const user = await collection.findOne({ email: email });

    if (!user) {
      throw new Error(httpStatus.NOT_FOUND, "User Not Found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by Email:", error);
    throw new Error(httpStatus.BAD_REQUEST, "Error fetching user by ID");
  } finally {
    if (client) {
      await client.close();
    }
  }
};



/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  let client;

  try {
    client = await connectToDatabase();
    const db = client.db("shopify-popup");
    const collection = db.collection("users");

    const user = await collection.findOne({ _id: userId });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    updateBody.verificationToken = null;
    updateBody.verificationTokenExpiresAt = null;

    Object.assign(user, updateBody);

    const updateDocument = { $set: updateBody };

    await collection.updateOne({ _id: user._id }, updateDocument);

    return user;
  } catch (error) {
    console.error(error);
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
};


export const verifyEmail = async (verifyEmailToken) => {
  let client;

  try {
    client = await connectToDatabase();
    const db = client.db("shopify-popup");
    const collection = db.collection("users");
    const user = await collection.findOne({
      verificationToken: verifyEmailToken,
    });

    if (!user) {
      throw new Error(httpStatus.NOT_FOUND, "Token doesn't match");
    }

    if (
      user.verificationTokenExpiresAt &&
      new Date() > user.verificationTokenExpiresAt
    ) {
      throw new Error(
        httpStatus.BAD_REQUEST,
        "Verification token has expired"
      );
    }

    await updateUserById(user._id, { isEmailVerified: true });
  } catch (error) {
    throw new Error(httpStatus.BAD_REQUEST, error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
};
