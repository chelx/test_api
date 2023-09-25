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

async function createTour(user_access_key_id, user_secret_access_key) {
  const HOST = "api.theta360devel.biz";
  const PATH = "/tours";
  const METHOD = "POST";
  const DATE = new Date().toUTCString();

  const queryParameters = {};
  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json'
  };

  const payload = {
    "metadata": {
      "custom_key": "T40000169",
      "title": "ホテル",
      "note": "A0000056",
      "location": {
        "address": "XX県XX市XX町１－１　XXビルXX号室",
        "geometry": {
          "latitude": "12.12345678",
          "longitude": "123.12345678"
        }
      }
    },
    "scenes": [
      {
        "sphere_id": "104kAa",
        "title": "エントランス",
        "first_view": {
          "hlookat": "0.0",
          "vlookat": "0.0",
          "fov": "52.0"
        },
        "telops": [
          {
            "text": "sample telop"
          }
        ],
        "annotations": [
          {
            "hlookat": "0.0",
            "vlookat": "0.0",
            "plane_id": "",
            "text": "<div>あああ<br>いいい</div>",
            "video_uri": "https://www.youtube.com/watch?v=j9xR3_daa4U",
            "icon": {
              "type": "info",
              // "plane_id": "100uKK"
            }
          }
        ],
        "links": [
          // {
          //   "hlookat": "90.12345",
          //   "vlookat": "45.12345",
          //   "destination": {
          //     "sphere_id": "104kAa"
          //   }
          // }
        ],
        // "children": [
        //   {
        //     "sphere_id": "104kAb",
        //     "title": "リビング家具入り",
        //     "telops": [
        //       {
        //         "text": "sample telop"
        //       }
        //     ],
        //     "annotations": [
        //       {
        //         "hlookat": "0.0",
        //         "vlookat": "0.0",
        //         "plane_id": "",
        //         "text": "<div>あああ</div>",
        //         "video_uri": "https://www.youtube.com/watch?v=j9xR3_daa4U",
        //         "icon": {
        //           "type": "info",
        //           "plane_id": "100uKK"
        //         }
        //       }
        //     ]
        //   }
        // ]
      }
    ],
    "maps": [
      {
        "plane_id": "100vQW",
        "markers": [
          {
            "sphere_id": "104kAa",
            "x": "0.5",
            "y": "0.8",
            "radar": {
              "direction": "180.0"
            }
          }
        ]
      }
    ],
    "bottom": {
      "type": "playersetting",
      "plane_id": "100vQW"
    },
    // "attachments": {
    //   "images": [
    //     {
    //       "plane_id": "100vQW",
    //       "title": "駐車場"
    //     }
    //   ]
    // },
    "published": "true",
    "viewer_password": "password"
  }

  const url = `https://${HOST}${PATH}`;
  console.log('Authorization:', headers["Authorization"]);

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
  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
  const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)

  if (userAccessKeyId) {
    await createTour(userAccessKeyId, USER_SECRET_ACCESS_KEY);
  }
}, 0);