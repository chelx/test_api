const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

async function getUserAccessKeyId(user_id) {
  const url = `https://api.theta360devel.biz/authentications/${user_id}`;
  try {
    const response = await axios.get(url);
    if (response.status === 201) {
      return response.data.user_access_key_id;
    } else if (response.status === 404) {
      console.log("User not found.");
      return null;
    } else {
      console.log("Unknown error occurred.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

function generateSignature(method, host, path, userSecretAccessKey, date) {
  const stringToSign = `${method}\n${host}\n${querystring.escape(path)}\n${date}`;
  const signature = crypto.createHmac('sha256', userSecretAccessKey)
    .update(stringToSign, 'utf-8')
    .digest('binary');
  return Buffer.from(signature, 'binary').toString('base64').trim();
}

async function getTours(userAccessKeyId, userSecretAccessKey) {
  const HOST = "api.theta360devel.biz";
  const PATH = "/tours";
  const METHOD = "GET";
  const DATE = new Date().toUTCString();

  const queryParameters = {};

  const headers = {
    'Authorization': `THETA360BIZ ${userAccessKeyId}:${generateSignature(METHOD, HOST, PATH, userSecretAccessKey, DATE)}`,
    'Date': DATE
  };

  const url = `https://${HOST}${PATH}?startIndex=3&count=1`;
  try {
    const response = await axios.get(url, {
      params: queryParameters,
      headers: headers
    });

    console.log('Authorization:', headers['Authorization']);

    if (response.status === 200) {
      console.log("Success:", response.data);
    } else {
      console.log("Failure:", response.status);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

setTimeout(async () => {
  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
  const userAccessKeyId = await getUserAccessKeyId(USER_ID);
  if (userAccessKeyId) {
    const data = await getTours(userAccessKeyId, USER_SECRET_ACCESS_KEY);
  }
}, 0);
