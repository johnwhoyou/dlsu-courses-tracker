const axios = require("axios");

const sendSMSUpdate = (phoneNumbers, message) => {
  const url = "https://api.itexmo.com/api/broadcast";
  const data = {
    Email: "johncarlo.joyo@gmail.com",
    Password: "p!n#eDV5yH4w@@bfYxPi",
    Recipients: phoneNumbers,
    Message: message,
    ApiCode: "TR-JOHNC675612_USF3Y",
    SenderId: "ITEXMO SMS",
    PriorityLevel: "HIGH",
  };

  axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

// sendSMSUpdate(
//   ["09177074814"],
//   "Hello world! Test message from johnwhoyou using ITEXMO API. atay ngano di man mugana"
// );
