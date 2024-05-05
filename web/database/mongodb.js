import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGODB_URL;


const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectToDatabase() {
  try {
    await client.connect();
    await seedData();

    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function seedData() {
  const db = client.db("shopify-popup");
  const collection = db.collection("rules");

  const count = await collection.countDocuments();
  if (count === 0) {
    const initialData = [
      {
        description: "show after seconds",
        value: 10,
        sequenceNumber:1
      },
      {
        description: "after scroll percent",
        value: 25,
        sequenceNumber:2
      },
      {
        description: "on exit intent",
        value: 0,
        sequenceNumber:3
      },
      {
        description: "inactivity time (second)",
        value: 50,
        sequenceNumber:4
      }
    ];

    await collection.insertMany(initialData);
  } 
}
