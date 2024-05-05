import jwt from "jsonwebtoken";
import moment from "moment";


export const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      "minutes"
    );
    const accessToken = generateToken(
      user._id,
      accessTokenExpires,
    );
  
    return accessToken
  };


  const generateToken = (userId, expires, secret = process.env.JWT_SECRET) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
    };
    return jwt.sign(payload, secret);
  };