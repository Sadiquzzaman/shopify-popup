import {
  createEvent,
  getEventCountsByPopupId,
  getDashboardData,
} from "../services/events.service.js";

export const generateEvent = async (req, res) => {
  try {
    const shopName = req.query.shop;
    const eventData = req.body;
    const newEvent = await createEvent(eventData, shopName);
    res.status(201).send({ success: true, event: newEvent });
  } catch (error) {
    console.error("Error creating new Event:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};

export const getEventCounts = async (req, res) => {
  try {
    const popupId = req.params.popupId;
    const counts = await getEventCountsByPopupId(popupId);
    res.status(200).json({ success: true, counts });
  } catch (error) {
    console.error("Error getting event counts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDashboardDataHandler = async (req, res) => {
  try {
    const shopName = req.query.shop;
    const status = req.query.popUpStatus;
    const popUpName = req.query.popUpName;
    const data = await getDashboardData(shopName,status,popUpName);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
