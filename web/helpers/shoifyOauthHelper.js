import axios from "axios";
import crypto from "crypto";
import { connectToDatabase } from "../database/mongodb.js";
import { generateUniqueNumber } from "../services/user.service.js";
import shopify from "../shopify.js";
import { generateAuthTokens } from "../utils/generate-tokens.js";
import { getShopDetails } from "../utils/shop-data.utils.js";

const generateNonce = () => {
  return crypto.randomBytes(16).toString("hex");
};

export const authorize = async (shop) => {
  const encodeUrl = encodeURI(
    `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${process.env.client_id}&scope=${process.env.scopes}&redirect_uri=${process.env.redirect_uri}`
  );
  return { url: encodeUrl };
};

export const redirect = async (code, shop, res) => {
  let shopifyOauthUri = `https://${shop}/admin/oauth/access_token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&code=${code}`;

  let client;
  try {
    client = await connectToDatabase();

    const db = client.db("shopify-popup");
    const sessionsCollection = db.collection("shopify_sessions");
    const usersCollection = db.collection("users");

    const response = await axios.post(shopifyOauthUri, {});
    const responseData = response.data;


    await sessionsCollection.updateOne(
      { shop: shop },
      {
        $set: {
          id: `offline_${shop}`,
          shop: shop,
          state: generateNonce(),
          isOnline: false,
          scope: responseData.scope,
          accessToken: responseData.access_token,
        },
      },
      { upsert: true }
    );

    const session = {
      id: `offline_${shop}`,
      shop: shop,
      state: generateNonce(),
      isOnline: false,
      scope: responseData.scope,
      accessToken: responseData.access_token,
    };


    const shopDetails = await getShopDetails(responseData.access_token, shop);

    const existingUser = await usersCollection.findOne({
      email: shopDetails.email,
    });

    let accessToken = null;
    
    let platformDomainPairs = [{ platform: "shopify", domain: shop }]; 
    
    if (existingUser) {
      platformDomainPairs = mergeUnique(
        existingUser.platformDomainPairs,
        platformDomainPairs,
        'platform'
      );

      accessToken = await generateAuthTokens(existingUser)
    
      await usersCollection.updateOne(
        { email: shopDetails.email },
        {
          $set: {
            platformDomainPairs: platformDomainPairs,
            accessToken: accessToken
          },
        }
      );
    } else {
      const userBody = {
        email: shopDetails.email,
        userId: await generateUniqueNumber(),
        platformDomainPairs: platformDomainPairs,
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        accessToken: accessToken
      };
    
      const user = await usersCollection.insertOne(userBody);
    
      accessToken = await generateAuthTokens(user)
    }

  
    const themes = await shopify.api.rest.Theme.all({
      session: session,
    });

    var theme = null;
    var themeid = "";

    for (let i = 0; i < themes.data.length; i++) {
      theme = themes.data[i];
      if (theme.role === "main") {
        themeid = theme.id;
        break;
      }
    }

    const mainAsset = await shopify.api.rest.Asset.all({
      session: session,
      theme_id: themeid,
      asset: { key: "layout/theme.liquid" },
    });

    const currentValue = mainAsset.data[0].value;

    const asset = new shopify.api.rest.Asset({
      session: session,
    });
    asset.theme_id = Number(themeid);
    asset.key = "layout/theme.liquid";

    const jqueryCDN =
      '<script src="https://code.jquery.com/jquery-3.6.4.min.js" defer="defer"></script>';

    const cssFirstLinkTag =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Sadiquzzaman/test/popupStyle.css" />';
    const cssSecondLinkTag =
      '<link rel="preconnect" href="https://fonts.googleapis.com" />';
    const cssThirdLinkTag =
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />';
    const cssFourthLinkTag =
      '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,200;1,9..40,300&display=swap" rel="stylesheet"/>';
    const scriptToInsert =
      '<script src="https://raselhasan356.github.io/popup.js" defer="defer"></script>';

    if (
      currentValue.includes(jqueryCDN) &&
      currentValue.includes(cssFirstLinkTag) &&
      currentValue.includes(cssSecondLinkTag) &&
      currentValue.includes(cssThirdLinkTag) &&
      currentValue.includes(cssFourthLinkTag) &&
      currentValue.includes(scriptToInsert)
    ) {
      return res.redirect(
        `http://192.168.11.6:3000/signin?shop=${shop}&token=${responseData.access_token}&accessToken=${accessToken}`
      );
    }

    const newContent = currentValue.replace(
      "</head>",
      `${jqueryCDN}\n${cssFirstLinkTag}\n${cssSecondLinkTag}\n${cssThirdLinkTag}\n${cssFourthLinkTag}\n${scriptToInsert}\n</head>`
    );

    asset.value = newContent;
    await asset.save({
      update: true,
    });

    res.redirect(
      `http://192.168.11.6:3000/signin?shop=${shop}&token=${responseData.access_token}&accessToken=${accessToken}`
    );
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching access token from Shopify");
  } finally {
    if (client) {
      await client.close();
    }
  }
};

/**
 * Helper function to merge arrays of objects based on a unique key
 * @param {Array} existingArray - Existing array of objects
 * @param {Array} newArray - New array of objects to be merged
 * @param {string} key - Unique key to identify objects
 * @returns {Array} - Merged array of objects
 */
function mergeUnique(existingArray, newArray, key) {
  const uniqueValues = new Set(existingArray.map(obj => obj[key]));

  newArray.forEach(newObj => {
    if (!uniqueValues.has(newObj[key])) {
      existingArray.push(newObj);
    }
  });

  return existingArray;
}
