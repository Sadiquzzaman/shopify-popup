import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = Joi.object({
  APP_URL: Joi.string().required(),
  NODE_ENV: Joi.string()
    .valid('production', 'development', 'test')
    .required(),
  APP_PORT: Joi.number().default(3000),
  MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description('minutes after which reset password token expires'),
  EMAIL_VERIFICATION_TOKEN_EXPIRATION_MINUTES: Joi.number()
    .default(10)
    .description('minutes after which email verification token expires'),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env, {
  errors: { label: 'key' },
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  app_url: envVars.APP_URL,
  env: envVars.NODE_ENV,
  port: envVars.APP_PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 60000,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    emailVerificationTokenExpirationMinutes:
      envVars.EMAIL_VERIFICATION_TOKEN_EXPIRATION_MINUTES,
  },
  email: {
    host: envVars.SMTP_Host,
    port: envVars.SMTP_Port,
    secure: false,
    user: envVars.EMAIL_USERNAME,
    pass: envVars.EMAIL_PASSWORD,
    from: envVars.EMAIL_FROM,
  },
  s3: {
    bucketName: envVars.AWS_S3_BUCKET_NAME,
    region: envVars.AWS_S3_BUCKET_REGION,
    accessKey: envVars.AWS_S3_BUCKET_ACCESS_KEY,
    secretKey: envVars.AWS_S3_BUCKET_SECRET_KEY,
  },
};

export default config;
