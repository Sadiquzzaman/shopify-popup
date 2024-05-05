import mongoose from "mongoose";
import { toJSON } from "./plugins/toJSON.plugin.js";
import { paginate } from "./plugins/paginate.plugin.js";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  userId: {
    type: String,
  },
  platformDomainPairs: [
    {
      platform: {
        type: String,
      },
      domain: {
        type: String,
      },
    },
  ],
  
  accessToken: {
    type: String,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };
  
const User = mongoose.model("users", userSchema);

export default User;
