import axios from "axios";

export async function getShopDetails(accessToken, shop) {
  const apiUrl = `https://${shop}/admin/shop.json`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
      },
    });

    return response.data.shop;
  } catch (error) {
    throw new Error("Failed to fetch shop data");
  }
}
