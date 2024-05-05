import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import passport from "passport";
import serveStatic from "serve-static";
import config from "./config/config.js";
import { errorHandler, successHandler } from "./config/morgan.js";
import { jwtStrategy } from "./config/passport.js";
import { redirect } from "./helpers/shoifyOauthHelper.js";
import routes from "./routes/v1/index.js";
import shopify from "./shopify.js";
import { errorConverter, errorsHandler } from "./middleware/error.js";
import ApiError from "./utils/ApiError.js";
import httpStatus from "http-status";

dotenv.config();

const PORT = parseInt("4000", 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

if (config.env !== "test") {
  app.use(successHandler);
  app.use(errorHandler);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set security HTTP headers
app.use(helmet());

app.use(cors());
const corsOptionsDelegate = function (req, callback) {
  const corsOptions = { origin: true };
  callback(null, corsOptions);
};

app.options("*", cors());
app.use(cors(corsOptionsDelegate));

app.get("/api/shopify/redirect", async (req, res) => {
  return res.json(await redirect(req.query.code, req.query.shop, res));
});

app.use(express.json());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/v1", routes);


// 404 error handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route Not found"));
});

// Error handling middleware
app.use(errorConverter);
app.use(errorsHandler);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));


app.listen(PORT);
