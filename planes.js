const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

const HOST = "api.theta360devel.biz";

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

async function deletePlanes(userAccessKeyId, userSecretAccessKey) {
  const PATH = "/planes/100trp";
  const METHOD = "DELETE";
  const DATE = new Date().toUTCString();


  const headers = {
    'Authorization': `THETA360BIZ ${userAccessKeyId}:${generateSignature(METHOD, HOST, PATH, userSecretAccessKey, DATE)}`,
    'Date': DATE
  };

  console.log(headers);

  const url = `https://${HOST}${PATH}`;
  console.log(url);
  try {
  const {data}=  await axios.delete(url, {
      headers: headers
    })
    console.log(data);
  } catch (error) {
    console.log(error.response.data);
  }

}

setTimeout(async () => {
  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
  const userAccessKeyId = await getUserAccessKeyId(USER_ID);
  if (userAccessKeyId) {
    const data = await deletePlanes(userAccessKeyId, USER_SECRET_ACCESS_KEY);
  }
}, 0);
