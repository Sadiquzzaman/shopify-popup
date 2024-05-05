import { createLead, getLeadData, getLeadsData } from "../services/leads.service.js";

export const generateLead = async (req, res) => {
  try {
    const shop = req.query.shop
    const leadData = req.body;
    const newLead = await createLead(leadData, shop);
    res.status(201).send({ success: true,  newLead });
  } catch (error) {
    console.error("Error creating new Lead:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const shopName = req.query.shop;
    const searchTerm = req.query.searchTerm
    const data = await getLeadsData(shopName,searchTerm);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error getting event counts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getLead = async (req, res) => {
  try {
    const popUpId = req.params.popUpId;
    const searchTerm = req.query.searchTerm
    const leads = await getLeadData(popUpId,searchTerm);
    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error("Error getting event counts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

