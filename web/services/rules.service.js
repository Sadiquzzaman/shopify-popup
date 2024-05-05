import { connectToDatabase } from "../database/mongodb.js";

export const createRule = async (description, value) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("rules");

    const newRule = {
      description,
      value,
    };

    const result = await collection.insertOne(newRule);
    const savedRule = {
      _id: result.insertedId,
      ...newRule,
    };

    return savedRule;
  } finally {
    if (client) {
      await client.close();
    }
  }
};


export const getRule = async () => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("rules");

    

    const rules = await collection.find().toArray();

    return rules;
  } finally {
    if (client) {
      await client.close();
    }
  }
};
