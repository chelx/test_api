const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

async function getUserAccessKeyId(user_id, user_secret_access_key) {
  const url = `https://api.theta360devel.biz/authentications/${user_id}`;
  const DATE = new Date().toUTCString();
  const signature = generateSignature("GET", "api.theta360.biz", `/authentications/${user_id}`, user_secret_access_key, DATE);

  const headers = {
    'Authorization': `THETA360BIZ ${user_id}:${signature}`,
    'Date': DATE
  };

  try {
    const response = await axios.get(url, { headers });
    if (response.status === 201) {
      console.log('response.data.user_access_key_id', response.data.user_access_key_id)
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

async function createPlanephotos(user_access_key_id, user_secret_access_key) {
  const HOST = "api.theta360devel.biz";
  const PATH = "/planephotos";
  const METHOD = "POST";
  const DATE = new Date().toUTCString();

  const queryParameters = {};
  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json'
  };

  const payload = {

  }

  const url = `https://${HOST}${PATH}`;
  console.log('Authorization:', headers["Authorization"]);

  try {
    const response = await axios.post(url, payload, { params: queryParameters, headers });
    if (response.status === 201) {
      console.log('Success create planephotos:', response.data);
      return response.data

    } else {
      console.log("Failure:", response.status);
      throw new Error("Unknown error occurred.");
    }
  } catch (error) {
    console.log("Failure:", error.response);
    console.error("Error createTour:", error.message);
    throw new Error("Unknown error occurred.");
  }
}

async function updatePlanephotos(planephotos_id, user_access_key_id, user_secret_access_key) {
  const HOST = "api.theta360devel.biz";
  const PATH = `/planephotos/${planephotos_id}`;
  const METHOD = "PUT";
  const DATE = new Date().toUTCString();

  const queryParameters = {};
  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json'
  };

  const payload = {
    "metadata": {
      "type": "6"
    }
  }
  try {
    const url = `https://${HOST}${PATH}`;
    const response = await axios.put(url, payload, { headers });
    if (response.status === 200) {
      console.log(`Success update planephotos id: ${planephotos_id}`, response.data);
    } else {
      console.error(`Failure: ${response.status}, ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('Error:', error.response);
  }
}

setTimeout(async () => {
  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
  const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)

  if (userAccessKeyId) {
    // const { edit } = await createPlanephotos(userAccessKeyId, USER_SECRET_ACCESS_KEY);
    // console.log("create planephotos url edit", edit);
    // const editId = edit.split("/").pop();
    await updatePlanephotos("67576", userAccessKeyId, USER_SECRET_ACCESS_KEY);
  }
}, 0);