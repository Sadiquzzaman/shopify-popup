import { connectToDatabase } from "../database/mongodb.js";
import { ObjectId } from "mongodb";
import { getPopUpByPopID } from "./popup-entity.service.js";

export const createEvent = async (eventData, shopName) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("events");
    const sessionsCollection = db.collection("shopify_sessions");

    // const shopSession = await sessionsCollection.findOne({
    //   accessToken: token,
    // });

    // if (!shopSession) {
    //   throw new Error("Shop not found for the provided token");
    // }
    const result = await collection.insertOne({
      ...eventData,
      shop: shopName,
    });

    const savedLead = {
      _id: result.insertedId,
      ...eventData,
      shop: shopName,
    };

    return savedLead;
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const getEventCountsByPopupId = async (popupId) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("events");
    const leadsCollection = db.collection("leads");

    const conversion = await leadsCollection.countDocuments({
      popUpId: popupId,
    });

    const viewCount = await collection.countDocuments({
      eventType: "View",
      popUpId: popupId,
    });

    const clickCount = await collection.countDocuments({
      eventType: "Click",
      popUpId: popupId,
    });

    const conversionRate = (conversion / viewCount) * 100;

    return {
      viewCount,
      clickCount,
      conversion,
      conversionRate,
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
};

export const getDashboardData = async (shopName,status,popUpName) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("events");
    const leadsCollection = db.collection("leads");
    const popupEntitiesCollection = db.collection("popupEntities");

    const filter = {
      shop: shopName,
      ...(status ? { activeStatus: status } : {}), 
      ...(popUpName ? { name: { $regex: new RegExp(popUpName, 'i') } } : {})
    };
    
    const popUps = await popupEntitiesCollection.find(filter).toArray();
    
    const popupData = [];
    
    for (const popUp of popUps) {
      const id = popUp._id.toString()
      const viewCount = await collection.countDocuments({
        eventType: "View",
        popUpId: id,
      });

      const clickCount = await collection.countDocuments({
        eventType: "Click",
        popUpId: id,
      });

      
      const conversion = await leadsCollection.countDocuments({
        popUpId: id,
      });

      const conversionRate =
      viewCount === 0 ? 0 : (conversion / viewCount) * 100;
      
      popupData.push({
        popup: popUp,
        viewCount,
        clickCount,
        conversion,
        conversionRate,
      });
    }
    
    return popupData;
  } finally {
    if (client) {
      await client.close();
    }
  }
};
