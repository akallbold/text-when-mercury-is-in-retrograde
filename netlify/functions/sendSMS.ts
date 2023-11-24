import twilio from "twilio";

export const handler = async () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  console.log("Welcome!");
  try {
    const isMercuryInRetrograde = await checkIfRetrograde(formatDate(today));
    const wasMercuryInRetrogradeYesterday = await checkIfRetrograde(
      formatDate(yesterday)
    );
    // if (isMercuryInRetrograde && !wasMercuryInRetrogradeYesterday) {
    sendMMS();
    // }
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
  console.log("send the SMS");
  const account_sid = process.env.ACCOUNT_SID;
  const auth_token = process.env.AUTH_TOKEN;
  const to_phone_number = process.env.TO_PHONE_NUMBER;
  const from_phone_number = process.env.FROM_PHONE_NUMBER;
  const message = `Mercury is in retrograde. Be careful out there!`;
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
      })
      .then((message) => console.log(message.sid));
  }
};
