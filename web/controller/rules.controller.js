import {
  getRule,
} from "../services/rules.service.js";


export const getRules = async (req, res) => {
    try {
      const data = await getRule();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getting popups:", error);
      res.status(500).json({ success: false, error: error.message });
    }
};