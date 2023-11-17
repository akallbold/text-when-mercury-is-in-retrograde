import twilio from "twilio";

export const handler = async () => {
  try {
    checkForMercuryAndSendSMS();
    return {
      statusCode: 200,
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

const checkForMercuryAndSendSMS = async () => {
  const mercury_api = process.env.MERCURY_API;
  const giphy_api = process.env.GIPHY_API;
  const giphy_api_key = process.env.GIPHY_API_KEY;
  if (mercury_api) {
    const isMercuryInRetrogradeFunctionToday = async () => {
      try {
        const response = await fetch(mercury_api, {
          method: "GET",
        });
        const data = await response.json();
        console.log("Is mercury in retrograde today?", data.is_retrograde);
        return data.is_retrograde;
      } catch (error) {
        console.error(error);
      }
    };

    const wasMercuryInRetrogradeYesterdayFunction = async () => {
      const dateNow = new Date();
      const yesterday = new Date(dateNow.setDate(dateNow.getDate() - 1));
      const yyyy = yesterday.getFullYear();
      const mm = String(yesterday.getMonth() + 1).padStart(2, "0");
      const dd = String(yesterday.getDate()).padStart(2, "0");
      const yesterdayFormatted = `${yyyy}-${mm}-${dd}`;
      try {
        const response = await fetch(
          `${mercury_api}?date=${yesterdayFormatted}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        console.log("Was mercury in retrograde yesterday?", data.is_retrograde);
        return data.is_retrograde;
      } catch (error) {
        console.error(error);
      }
    };
    // get mercury in retrograde gif
    const getRandomGif = async () => {
      const searchString = "mercury+is+in+retrograde";

      try {
        const response = await fetch(
          `${giphy_api}?api_key=${giphy_api_key}&q=${searchString}&limit=10&offset=0&rating=g&lang=en&bundle=messaging_non_clips`,
          {
            method: "GET",
          }
        );

        const data = await response.json();
        const gifArray = data.data;
        const randomIndex = Math.floor(Math.random() * gifArray.length);
        const randomImage = gifArray[randomIndex].images.original.url;
        return randomImage;
      } catch (error) {
        console.error(error);
      }
    };

    const isMercuryInRetrograde = await isMercuryInRetrogradeFunctionToday();
    const wasMercuryInRetrogradeYesterday =
      await wasMercuryInRetrogradeYesterdayFunction();
    const randomGif = await getRandomGif();

    // if (isMercuryInRetrograde && !wasMercuryInRetrogradeYesterday){
    if (true) {
      const account_sid = process.env.ACCOUNT_SID;
      const auth_token = process.env.AUTH_TOKEN;
      const to_phone_number = process.env.TO_PHONE_NUMBER;
      const from_phone_number = process.env.FROM_PHONE_NUMBER;
      const message = `Mercury is in retrograde. Be careful out there!`;
      if (to_phone_number && from_phone_number && account_sid && auth_token) {
        let client = twilio(account_sid, auth_token);
        client.messages
          .create({
            body: message,
            to: to_phone_number,
            from: from_phone_number,
            mediaUrl: randomGif,
          })
          .then((message) => console.log(message.sid));
      }
    }
  }
};
