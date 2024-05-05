import { ObjectId } from "mongodb";
import { connectToDatabase } from "../database/mongodb.js";
import { getShopDetails } from "../utils/shop-data.utils.js";
import { sendConfirmationEmail, sendLeadEmail } from "./email.service.js";

export const createLead = async (leadData, shopName) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("leads");
    const eventsCollection = db.collection("events");
    const sessionsCollection = db.collection("shopify_sessions");

    const shopSession = await sessionsCollection.findOne({
      shop: shopName,
    });

    if (!shopSession) {
      throw new Error("Shop not found for the provided shop");
    }

    const eventData = {
      eventType: "View",
      popUpId: leadData.popUpId,
    };

    await eventsCollection.insertOne({
      ...eventData,
      shop: shopName,
    });

    const result = await collection.insertOne({
      ...leadData,
      shop: shopName,
      createdAt: new Date(),
    });

    const savedLead = {
      _id: result.insertedId,
      ...leadData,
      shop: shopName,
      createdAt: new Date(),
    };

    const shop = await getShopDetails(shopSession.accessToken, shopName);

    await sendConfirmationEmail(leadData.email);

    await sendLeadEmail(shop.email, leadData.email);

    return savedLead;
  } finally {
    if (client) {
      await client.close();
    }
  }
};


export const getLeadsData = async (shopName, searchTerm) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("leads");
    const popupEntitiesCollection = db.collection("popupEntities");

    const popUpFilter = {
      shop: shopName,
      ...(searchTerm ? { name: { $regex: new RegExp(searchTerm, "i") } } : {}),
    };

    const popUps = await popupEntitiesCollection.find(popUpFilter).toArray();
    const totalPopups = popUps.length;
    let leadCount = 0;
    let popupMaxLeadCount = 0;
    let popupWithMaxLeads = null;
    const popUpIds = popUps.map((popUp) => popUp._id.toString());

    const leadFilter = {
      popUpId: { $in: popUpIds },
    };

    const leads = await collection.find(leadFilter).toArray();

    const leadData = [];
    const leadCountByDate = {}; 

    popUps.forEach((popUp) => {
      const filteredLeads = leads.filter(
        (lead) => lead.popUpId === popUp._id.toString()
      );

      filteredLeads.forEach((lead) => {
        const leadDate = lead.createdAt.toISOString().split('T')[0];
        leadCountByDate[leadDate] = (leadCountByDate[leadDate] || 0) + 1;
      });

      leadData.push({
        popup: popUp,
        leads: filteredLeads,
      });

      const currentLeadCount = filteredLeads.length;
      leadCount += currentLeadCount;

      if (currentLeadCount > popupMaxLeadCount) {
        popupMaxLeadCount = currentLeadCount;
        popupWithMaxLeads = popUp.name;
      }
    });

    const highestLeadDate = Object.keys(leadCountByDate).reduce((a, b) =>
      leadCountByDate[a] > leadCountByDate[b] ? a : b
    );

    return {
      leadData,
      totalPopups,
      leadCount,
      highestLeadDate,
      popupWithMaxLeads,
      popupMaxLeadCount,
    };
  } finally {
    if (client) {
      await client.close();
    }
  }
};



export const getLeadData = async (popUpId, searchTerm) => {
  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const collection = db.collection("leads");
    const popupEntitiesCollection = db.collection("popupEntities");

    const filter = {
      popUpId: popUpId,
      ...(searchTerm ? { email: { $regex: new RegExp(searchTerm, "i") } } : {}),
      ...(searchTerm ? { name: { $regex: new RegExp(searchTerm, "i") } } : {}),
    };

    const popUp = await popupEntitiesCollection.findOne({
      _id: new ObjectId(popUpId),
    });
    const leadsData = await collection.find(filter).toArray();

    const leads = {
      popUp: popUp,
      leads: leadsData,
    };

    return leads;
  } finally {
    if (client) {
      await client.close();
    }
  }
};