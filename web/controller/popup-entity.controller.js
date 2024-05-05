import httpStatus from "http-status";
import { uploadFileToS3 } from "../s3/s3.js";
import {
  createPopUp,
  deletePopUpByIds,
  getPopUp,
  getPopUpByPopID,
  getTotalPopups,
  updatePopUp,
} from "../services/popup-entity.service.js";

export const createPopUpEntity = async (req, res) => {
  try {
    const popUpData = req.body;

    if (!popUpData.name) {
      const latestPopUpCount = await getTotalPopups();
      const nextNumber = latestPopUpCount +1;
      const shopName = popUpData.shop.split('.')[0];

      popUpData.name = `${shopName}_poptrigg_${nextNumber}`;
    }

    const newPopUp = await createPopUp({
      ...popUpData,
    });

    res.status(201).send({ success: true, popUp: newPopUp });
  } catch (error) {
    console.error("Error creating pop-up entity:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};


export const getPopUps = async (req, res) => {
  try {
    const popupStatus = req.query.popupStatus;
    const shop = req.query.shop;
    const data = await getPopUp(popupStatus, shop);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error getting popups:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePopUpEntity = async (req, res) => {
  try {
    const popupId = req.params.id;
    const updateData = req.body;

    let fileUrl = null;

    if (req.file) {
      fileUrl = await uploadFileToS3(req.file, "images");
    }

    updateData.background = updateData.background
      ? JSON.parse(updateData.background)
      : null;
    updateData.headingField = updateData.headingField
      ? JSON.parse(updateData.headingField)
      : null;
    updateData.inputFieldLabel01 = updateData.inputFieldLabel01
      ? JSON.parse(updateData.inputFieldLabel01)
      : null;
    updateData.inputFieldLabel02 = updateData.inputFieldLabel02
      ? JSON.parse(updateData.inputFieldLabel02)
      : null;
    updateData.submitButtonField = updateData.submitButtonField
      ? JSON.parse(updateData.submitButtonField)
      : null;
    updateData.rules = updateData.rules ? JSON.parse(updateData.rules) : null;

    const updatedPopupData = { ...updateData };
    if (fileUrl) {
      updatedPopupData[updateData.image_type] = fileUrl;
    }

    const updatedPopup = await updatePopUp(popupId, updatedPopupData);

    // if (!req.file) {
    //   delete updatedPopup[updateData?.image_type];
    //   delete updatedPopup?.image_type;
    // }

    res.status(200).json({ success: true, updatedPopup });
  } catch (error) {
    console.error("Error updating popup:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPopUpById = async (req, res) => {
  try {
    const popupId = req.params.id;
    const popup = await getPopUpByPopID(popupId);
    res.status(200).json({ success: true, popup: popup });
  } catch (error) {
    console.error("Error getting popup:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePopup = async (req, res) => {
  try {
    const popUpIds = req.body.popupIds;
    await deletePopUpByIds(popUpIds);
    res.status(httpStatus.OK).send({ message: "Popup deleted successfully" });
  } catch (error) {
    console.error("Error getting popup:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
