const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

async function getUserAccessKeyId(user_id, user_secret_access_key) {
  const url = `https://api.theta360devel.biz/authentications/${user_id}`;
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

const getListTours = async (user_access_key_id, user_secret_access_key) => {
  const HOST = "api.theta360devel.biz";
  const PATH = `/tours`;
  const METHOD = "GET";
  const DATE = new Date().toUTCString();

  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json'
  };
  try {
    const { data } = await axios.get(`https://${HOST}${PATH}`, { headers });
    console.log(data);
  } catch (error) {
    console.log("error", error.response)
  }
}

setTimeout(async () => {
  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
  const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)
  if (userAccessKeyId) {
    await getListTours(userAccessKeyId, USER_SECRET_ACCESS_KEY)
  }
}, 0);