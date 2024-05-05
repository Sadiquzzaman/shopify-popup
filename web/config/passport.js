import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { ObjectId } from "mongodb";

import { MongoClient } from 'mongodb';

const connectToDatabase = async () => {
  const client = new MongoClient('mongodb://shopifyPopup:password@localhost:27017/shopify-popup', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

const jwtOptions = {
  secretOrKey: "thisisasamplesecret",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const jwtVerify = async (payload, done) => {
  let client;

  try {
    client = await connectToDatabase();
    const db = client.db('shopify-popup');
    const collection = db.collection('users');

    const user = await collection.findOne({ _id: new ObjectId(payload.sub) });

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);


