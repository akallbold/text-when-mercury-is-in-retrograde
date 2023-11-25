import twilio from "twilio";

export const handler = async () => {
  console.log("Welcome!");
  const retrograde_endpoint = process.env.RETROGRADE_ENDPOINT;
  if (retrograde_endpoint) {
    console.log({ retrograde_endpoint });

    try {
      const response = await fetch(retrograde_endpoint, {
        method: "GET",
      });
      return {
        statusCode: 200,
      };
    } catch (error) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
};

// get mercury in retrograde gif
const getRandomGif = async () => {
  const giphy_api = process.env.GIPHY_API;
  const giphy_api_key = process.env.GIPHY_API_KEY;
  console.log("In getRandomGif func");
  const searchString = "mercury+is+in+retrograde";
  if (giphy_api && giphy_api_key) {
    console.log("we have giphy_api && giphy_api_key");
    try {
      const response = await fetch(
        `${giphy_api}?api_key=${giphy_api_key}&q=${searchString}&limit=10&offset=0&rating=g&lang=en&bundle=messaging_non_clips`,
        {
          method: "GET",
        }
      );
      console.log("finished success");
      const data = await response.json();
      console.log({ data });
      const gifArray = data.data;
      const randomIndex = Math.floor(Math.random() * gifArray.length);
      const randomImage = gifArray[randomIndex].images.original.url;
      return randomImage;
    } catch (error) {
      console.log("finished fail");
      console.error(error);
    }
  }
};

const checkIfRetrograde = async (date) => {
  const mercury_api = process.env.MERCURY_API;
  if (mercury_api) {
    try {
      const response = await fetch(`${mercury_api}?date=${date}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log("Was mercury in retrograde on:", date, data.is_retrograde);
      return data.is_retrograde;
    } catch (error) {
      console.error(error);
    }
  }
};

const formatDate = (rawDate) => {
  const yyyy = rawDate.getFullYear();
  const mm = String(rawDate.getMonth() + 1).padStart(2, "0");
  const dd = String(rawDate.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const sendMMS = async () => {
  console.log(" send the MMS");
  const account_sid = process.env.ACCOUNT_SID;
  const auth_token = process.env.AUTH_TOKEN;
  const to_phone_number = process.env.TO_PHONE_NUMBER;
  const from_phone_number = process.env.FROM_PHONE_NUMBER;
  const message = `Mercury is in retrograde. Be careful out there!MMS`;
  // const randomGif = await getRandomGif();
  if (to_phone_number && from_phone_number && account_sid && auth_token) {
    console.log(
      "We have to_phone_number && from_phone_number && account_sid && auth_token"
    );
    let client = twilio(account_sid, auth_token);
    console.log("Twilio config created");
    client.messages
      .create({
        body: message,
        to: to_phone_number,
        from: from_phone_number,
        // mediaUrl: randomGif,
      })
      .then((message) => console.log(message.sid));
  }
};
