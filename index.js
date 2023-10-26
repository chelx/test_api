const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

const HOST = "api.theta360devel.biz";

async function getUserAccessKeyId(user_id) {
  const url = `https://${HOST}/authentications/${user_id}`;
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

function generateSignature(method, host, path, user_secret_access_key, date) {
  const stringToSign = `${method}\n${host}\n${querystring.escape(path)}\n${date}`;
  const signature = crypto.createHmac('sha256', user_secret_access_key)
    .update(stringToSign, 'utf-8')
    .digest('binary');
  return Buffer.from(signature, 'binary').toString('base64').trim();
}

async function getTourById(tour_id, user_access_key_id, user_secret_access_key, custom_key = null) {

  const PATH = `/tours/${tour_id}`;
  const METHOD = "GET";
  const DATE = new Date().toUTCString();

  const queryParameters = {};
  if (custom_key) {
    queryParameters['custom_key'] = custom_key;
  }

  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE
  };

  const url = `https://${HOST}${PATH}`;
  console.log('Authorization:', headers["Authorization"]);

  try {
    const response = await axios.get(url, { params: queryParameters, headers });
    if (response.status === 200) {
      console.log("Success:", JSON.stringify(response.data, null, 2));
    } else if ([401, 403, 404].includes(response.status)) {
      console.log(`Failure: ${response.status}, ${JSON.stringify(response.data)}`);
    } else {
      console.log("Unknown error occurred.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function getListSpheres(user_access_key_id, user_secret_access_key) {
  const PATH = `/spheres`;
  const METHOD = "GET";
  const DATE = new Date().toUTCString();
  const queryParameters = {};
  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE
  };

  const url = `https://${HOST}${PATH}`;
  console.log('Authorization:', headers["Authorization"]);

  try {
    const response = await axios.get(url, { params: queryParameters, headers });
    if (response.status === 200) {
      console.log("Success:", JSON.stringify(response.data, null, 2));
    } else if ([401, 403, 404].includes(response.status)) {
      console.log(`Failure: ${response.status}, ${JSON.stringify(response.data)}`);
    } else {
      console.log("Unknown error occurred.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const getListTours = async (user_access_key_id, user_secret_access_key) => {
  const PATH = `/tours`;
  const METHOD = "GET";
  const DATE = new Date().toUTCString();

  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json'
  };
  try {
    const { data } = await axios.get(`https://${HOST}${PATH}?startIndex=1&count=10`, { headers });
    const { tours } = data
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("error", error.response)
  }
}

setTimeout(async () => {
  // const USER_ID = "rits1_user_access_id"
  // const USER_SECRET_ACCESS_KEY = "rits1_secret_access_key"


  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"

  const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)
  console.log('userAccessKeyId---', userAccessKeyId)
  if (userAccessKeyId) {
    // await getTourById('101FA7', userAccessKeyId, USER_SECRET_ACCESS_KEY);
    await getListTours(userAccessKeyId, USER_SECRET_ACCESS_KEY);
  }
}, 0);