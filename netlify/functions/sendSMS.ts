import twilio from "twilio";

export const handler = async () => {
  console.log("Welcome!");
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
  if (mercury_api && giphy_api && giphy_api_key) {
    console.log("We have a mercury_api && giphy_api && giphy_api_key!");
    const isMercuryInRetrogradeFunctionToday = async () => {
      console.log(
        "Welcome to the isMercuryInRetrogradeFunctionToday function!"
      );

      try {
        const response = await fetch(mercury_api, {
          method: "GET",
        });
        const data = await response.json();
        console.log("Is mercury in retrograde today?", data.is_retrograde);
        return data.is_retrograde;
      } catch (error) {
        console.log(error);
      }
    };

    const wasMercuryInRetrogradeYesterdayFunction = async () => {
      console.log(
        "Welcome to the wasMercuryInRetrogradeYesterdayFunction function!"
      );

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
        console.log(error);
      }
    };
    // get mercury in retrograde gif
    const getRandomGif = async () => {
      console.log("In getRandomGif func");
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

    // if (isMercuryInRetrograde && !wasMercuryInRetrogradeYesterday){
    if (true) {
      console.log(
        "Now we are in the part of the code where we have determined we need to send the MMS"
      );

      const account_sid = process.env.ACCOUNT_SID;
      const auth_token = process.env.AUTH_TOKEN;
      const to_phone_number = process.env.TO_PHONE_NUMBER;
      const from_phone_number = process.env.FROM_PHONE_NUMBER;
      const message = `Mercury is in retrograde. Be careful out there!`;
      const randomGif = await getRandomGif();
      if (to_phone_number && from_phone_number && account_sid && auth_token) {
        console.log("We have the vars we need");
        let client = twilio(account_sid, auth_token);
        console.log("Twilio config created");
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
