const readline = require("readline");
const fetchCfClearance = require("./fetchCfClearance");
const fetchCourseData = require("./fetchCourseData");
const sendSMSUpdate = require("./sendSMSUpdate");

let previousData;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const main = async () => {
  console.log(`*********************************************************
*                                                       *
*       Welcome to the DLSU Course Slots Tracker!       *
*                                                       *
*********************************************************

Brought to you by: John Carlo Joyo | ID120

This application will fetch course data from the DLSU enrollment website.
You will be asked to input a Class Number, Course Code, and Phone Number.
The app will fetch course data and check for changes every 5 minutes.
If a change is detected, an SMS notification will be sent to your phone number.

Usage:
1. Enter the course code you want to monitor.
2. Enter the class number you want to monitor.
3. Enter your phone number to get updates.

Example:
Course Code: CCAPDEV
Class Number: 2961
Phone Number: 09260296667
`);

  rl.question("Enter Course Code: ", async (courseCode) => {
    rl.question("Enter Class Number: ", async (classNo) => {
      console.log("Fetching CloudFlare cookie...");
      let { cfClearance, userAgent } = await fetchCfClearance();

      const fetchData = async () => {
        console.log("\nFetching course data...");
        const result = await fetchCourseData(
          cfClearance,
          userAgent,
          classNo,
          courseCode
        );

        if (result && result.cfClearance && result.userAgent) {
          cfClearance = result.cfClearance;
          userAgent = result.userAgent;
        }

        const newData = result.data;

        if (
          previousData &&
          JSON.stringify(previousData) !== JSON.stringify(newData)
        ) {
          const message = `There are changes regarding your tracked course:\n\n${JSON.stringify(newData, null, 2)}`;
          sendSMSUpdate(message);
        }

        previousData = newData;
      };

      fetchData();
      setInterval(fetchData, 5 * 60 * 1000); // 5 minutes interval

      rl.close();
    });
  });
};

main();
