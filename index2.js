const axios = require('axios');
const crypto = require('crypto');
const querystring = require('querystring');
const HOST = "api.theta360devel.biz";

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

async function updateTour(tour_id, user_access_key_id, user_secret_access_key, custom_key, payload) {
  const PATH = `/tours/${tour_id}`;
  const METHOD = "PUT";
  const DATE = new Date().toUTCString();

  const headers = {
    'Authorization': `THETA360BIZ ${user_access_key_id}:${generateSignature(METHOD, HOST, PATH, user_secret_access_key, DATE)}`,
    'Date': DATE,
    'Content-Type': 'application/json'
  };

  const url = `https://${HOST}${PATH}?custom_key=${custom_key}`;
  console.log('Authorization:', headers["Authorization"]);

  try {
    const response = await axios.put(url, payload, { headers });
    if (response.status === 200) {
      console.log("Success:", response.data);
    } else if ([400, 401, 403, 404].includes(response.status)) {
      console.log(`Failure: ${response.status}, ${JSON.stringify(response.data)}`);
    } else {
      console.log("Unknown error occurred.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

const PUT_TOUR_PAYLOAD = {
  metadata: {},
  "scenes": [
    {
      "sphere_id": "104ctQ",
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
          "name": "scene_104ctQanno0",
          "style": "annotation_style_video",
          "crop": "0|0|45|45",
          "disptype": "modal",
          "hlookat": "0.0",
          "vlookat": "0.0",
          "plane_id": "",
          "text": "<div>あああ<br>いいい</div>",
          "video_uri": "https://www.youtube.com/watch?v=jfKfPfyJRdk",
          "icon": {
            "type": "video",
            "plane_id": ""
          }
        }
      ],
      "links": [],
      "children": []
    }
  ],
  maps: [],
  bottom: { type: "playersetting" },
  attachments: { images: [] },
  published: "true",
  viewer_password: "password",
};

setTimeout(async () => {
  const USER_ID = "u4fUG4zjQh"
  const USER_SECRET_ACCESS_KEY = "QUXkD75ACe5txCesBajdyNwC3mFhww"
  const TOUR_ID = "101F9C"; // tour_id cần update
  const CUSTOM_KEY = '';
  const userAccessKeyId = await getUserAccessKeyId(USER_ID, USER_SECRET_ACCESS_KEY)
  if (userAccessKeyId) {
    await updateTour(TOUR_ID, userAccessKeyId, USER_SECRET_ACCESS_KEY, CUSTOM_KEY, PUT_TOUR_PAYLOAD)
  }
}, 0);