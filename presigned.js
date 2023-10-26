const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');
const HOST = "api.theta360stage.biz";

async function getUserAccessKeyId(user_id, user_secret_access_key) {
  const url = `https://${HOST}/authentications/${user_id}`;
  const DATE = new Date().toUTCString();
  const signature = generateSignature("GET", "api.theta360devel.biz", `/authentications/${user_id}`, user_secret_access_key, DATE);

  const headers = {
    'Authorization': `THETA360BIZ ${user_id}:${signature}`,
    'Date': DATE
  };

  try {
    const response = await axios.get(url, { headers });
    if (response.status === 201) {
      return response.data.user_access_key_id;
    } else {
      console.log(`Failed to get user_access_key_id: ${response.status}, ${JSON.stringify(response.data)}`);
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

function generateSignature(method, host, path, user_secret_access_key, date) {
  const stringToSign = `${method}\n${host}\n${querystring.escape(path)}\n${date}`;
  const signature = crypto.createHmac('sha256', user_secret_access_key)
    .update(stringToSign, 'utf-8')
    .digest('binary');
  return Buffer.from(signature, 'binary').toString('base64').trim();
}

const createPresignedConsoleUri = async (user_access_key_id, user_secret_access_key) => {
  const PATH = "/presigned_console_uri";
  const METHOD = "POST";
  const DATE = new Date().toUTCString();

  const queryParameters = {};
  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json'
  };

  const payload = {
    "target_uri": "https://sso.theta360stage.biz/ja/console/tours/new",
    "callback_uri": "https://hogehoge.biz/tours",
    "options": {
      "base_tour_id": "BjR",
      "hidden": [
       "annotation_image"
      ],
      "max_scenes": "5"
    }
  }

  const url = `https://${HOST}${PATH}`;
  try {
    const response = await axios.post(url, payload, { params: queryParameters, headers });
    if (response.status === 201) {
      console.log("Success:", response.data);
    } else {
      console.log("Failure:", response.status);
    }
  } catch (error) {
    console.log("Failure:", error.response);
    console.error("Error createTour:", error.message);
  }
}


setTimeout(async () => {
  const USER_ID = "rits1_user_access_id"
  const USER_SECRET_ACCESS_KEY = "rits1_secret_access_key"

  const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)
  if (userAccessKeyId) {
    return await createPresignedConsoleUri(userAccessKeyId, USER_SECRET_ACCESS_KEY)
  }
}, 0);