import twilio from "twilio";

export const handler = async () => {
  try {
    // if (isMercuryInRetrograde && !wasMercuryInRetrogradeYesterday) {
    sendSMS();
    // }
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ error: error.message }),
    };
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

const sendSMS = async () => {
  const account_sid = process.env.ACCOUNT_SID;
  const auth_token = process.env.AUTH_TOKEN;
  const to_phone_number = process.env.TO_PHONE_NUMBER;
  const from_phone_number = process.env.FROM_PHONE_NUMBER;
  const message = `Mercury is in retrograde. Be careful out there!MMS`;
  // const randomGif = await getRandomGif();
  if (to_phone_number && from_phone_number && account_sid && auth_token) {
    const client = twilio(account_sid, auth_token);
    console.log("Twilio config created", { client });
    try {
      console.log("Client.messages", client.messages);
      const resp = await client.messages.create({
        body: message,
        to: to_phone_number,
        from: from_phone_number,
        // mediaUrl: randomGif,
      });
      console.log({ resp });
      console.log("Message sent: ", resp.sid);
    } catch (error) {
      console.error(error);
    }
  }
};
