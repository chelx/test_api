const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');

function getCurrentGMTDate() {
  return new Date().toUTCString();
}

function generateSignature(method, host, path, userSecretAccessKey, date) {
  const stringToSign = `${method}\n${host}\n${querystring.escape(path)}\n${date}`;
  const signature = crypto.createHmac('sha256', userSecretAccessKey)
    .update(stringToSign, 'utf-8')
    .digest('binary');
  return Buffer.from(signature, 'binary').toString('base64').trim();
}

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

async function updateTour(tourId, userAccessKeyId, userSecretAccessKey, customKey, payload) {
  const HOST = 'api.theta360devel.biz';
  const PATH = `/tours/${tourId}`;
  const METHOD = 'PUT';
  const DATE = getCurrentGMTDate();

  const headers = {
    'Authorization': `THETA360BIZ ${userAccessKeyId}:${generateSignature(METHOD, HOST, PATH, userSecretAccessKey, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json',
  };

  const url = `https://${HOST}${PATH}?custom_key=${customKey}`;
  console.log('Authorization:', headers.Authorization);

  try {
    const response = await axios.put(url, payload, { headers });
    if (response.status === 200) {
      console.log('Success:', response.data);
    } else {
      console.error(`Failure: ${response.status}, ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    console.error('Error:', error.response);
  }
}

// setTimeout(async () => {
//   const USER_ID = "u4fUG4zjQh"
//   const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
//   const TOUR_ID = "101Hav"
//   const CUSTOM_KEY = false
//   const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)
//   if (userAccessKeyId) {
//     const payload = {
//       "scenes": [
//         {
//           "sphere_id": "104kAa",
//           "title": "",
//           "first_view": {
//             "hlookat": "0.0",
//             "vlookat": "0.0",
//             "fov": "52.0"
//           },
//           "telops": [],
//           "annotations": [
//             {
//               "name": "scene_104kAXanno0",
//               "style": "annotation_style",
//               "crop": "0|0|45|45",
//               "disptype": "modal",
//               "hlookat": "0.0",
//               "vlookat": "0.0",
//               "plane_id": "",
//               "text": "",
//               "video_uri": "",
//               "icon": {
//                 "type": "info",
//                 "plane_id": "100uKK"
//               }
//             }
//           ],
//           "links": [],
//           "children": [
//             {
//               "sphere_id": "104kAa",
//               "title": "",
//               "telops": [],
//               "annotations": [
//                 {
//                   "hlookat": "0.0",
//                   "vlookat": "0.0",
//                   "plane_id": "",
//                   "text": "",
//                   "video_uri": "",
//                   "icon": {
//                     "type": "custom",
//                     "plane_id": "100vQQ"
//                   }
//                 }
//               ]
//             }
//           ]
//         }
//       ],

//     };
//     await updateTour(TOUR_ID, userAccessKeyId, USER_SECRET_ACCESS_KEY, CUSTOM_KEY, payload);
//   }
// }, 0);

async function updatePlanePhoto(userAccessKeyId, userSecretAccessKey,) {
  const HOST = 'api.theta360devel.biz';
  const PATH = `/planephotos/100vQI`;
  const METHOD = 'PUT';
  const DATE = getCurrentGMTDate();

  const url = `https://${HOST}${PATH}`;
  const headers = {
    'Authorization': `THETA360BIZ ${userAccessKeyId}:${generateSignature(METHOD, HOST, PATH, userSecretAccessKey, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json',
  };
  try {
    await axios.put(url, { "metadata": { "type": "6" } }, { headers });
  } catch (error) {
    console.log('Error:', error.response);
  }
}

setTimeout(async () => {
  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
  const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)
  if (userAccessKeyId) {
    await updatePlanePhoto(userAccessKeyId, USER_SECRET_ACCESS_KEY);
  }

}, 0);
