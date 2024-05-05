import passport from "passport";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError.js";


const verifyCallback = (resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  if (!user.isEmailVerified) {
    return reject(
      new ApiError(httpStatus.UNAUTHORIZED, "Please verify your email")
    );
  }

  resolve(user);
};

export const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(resolve, reject)
    )(req, res, next);
  })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => next(err));
};

