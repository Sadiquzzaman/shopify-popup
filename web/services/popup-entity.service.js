import { connectToDatabase } from "../database/mongodb.js";
import { ObjectId } from "mongodb";

export const createPopUp = async (popUpData) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("popupEntities");

    const result = await collection.insertOne({
      ...popUpData,
      createdAt:new Date(),
      activeStatus: "inactive",
      totalMouseOut:0,
      totalInactivity:0
    });

    const savedPopUp = {
      _id: result.insertedId,
      ...popUpData,
      createdAt:new Date(),
      activeStatus: "inactive",
      totalMouseOut:0,
      totalInactivity:0
    };

    return savedPopUp;
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const getTotalPopups = async () => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("popupEntities");

    const totalPopups = await collection.countDocuments();

    return totalPopups;
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const getPopUp = async (shop) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("popupEntities");

    const filter = {
      shop: shop,
      activeStatus: "active"
    };

    const popUp = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    return popUp; 
  } finally {
    if (client) {
      await client.close();
    }
  }
};


export const updatePopUp = async (popupId, updateData) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("popupEntities");

    const filter = {
      _id: new ObjectId(popupId),
    };

    const existingPopup = await collection.findOne(filter);

    if(!updateData.activeStatus){
      updateData.activeStatus = "active"
    }

    const mergedData = { ...existingPopup, ...updateData };
    Object.keys(mergedData).forEach((key) => {
      if (mergedData[key] === undefined || mergedData[key] === null) {
        delete mergedData[key];
      }
    });

    const update = {
      $set: mergedData,
    };

    const options = {
      returnDocument: "after",
    };

    const updatedPopup = await collection.findOneAndUpdate(filter, update, options);

    return updatedPopup.value;
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const getPopUpByPopID = async (popUpId) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("popupEntities");

    const objectId = new ObjectId(popUpId);

    const popUp = await collection.findOne({
      _id:objectId
    });

    if(!popUp){
      throw new Error("Pop Up not found")
    }

    return popUp;
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const deletePopUpByIds = async (popUpIds) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("popupEntities");

    const objectIdPopUpIds = popUpIds.map(id => new ObjectId(id));

    const deleteResult = await collection.deleteMany({ _id: { $in: objectIdPopUpIds } });

    if (deleteResult.deletedCount === 0) {
      throw new Error('No documents found to delete.');
    }

  } finally {
    if (client) {
      await client.close();
    }
  }
};
