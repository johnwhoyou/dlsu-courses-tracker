const axios = require("axios");
const cheerio = require("cheerio");
const fetchCfClearance = require("./fetchCfClearance");

const fetchCourseData = async (cookie, userAgent, classNo, courseCode) => {
  const url = "https://enroll.dlsu.edu.ph/dlsu/view_course_offerings";
  const headers = {
    Cookie: `cf_clearance=${cookie}`,
    "User-Agent": userAgent,
  };
  const data = `p_course_code=${courseCode}&p_option=all&p_button=Search&p_id_no=12016578&p_button=Submit`;

  try {
    const response = await axios.post(url, data, { headers });

    const $ = cheerio.load(response.data);
    const rows = $("table tr");
    let foundData;

    rows.each((index, row) => {
      const tds = $(row).find('td.data[bgcolor="#D2EED3"]');

      if (tds.length >= 9) {
        const classNumber = parseInt(tds.eq(0).text().trim());

        if (classNumber === parseInt(classNo)) {
          const capacity = parseInt(tds.eq(6).text().trim());
          const enrolled = parseInt(tds.eq(7).text().trim());
          const course = tds.eq(1).text().trim();
          const section = tds.eq(2).text().trim();
          const remarks = tds.eq(8).text().trim();
          let professor = "";

          for (let i = 1; i <= 2; i++) {
            const nextRow = rows.eq(index + i);
            const nextRowData = nextRow.find("td.data");

            if (
              nextRowData.length === 1 &&
              nextRowData.attr("align") === "right"
            ) {
              professor = nextRowData.text().trim();
              break;
            }
          }

          foundData = {
            classNumber,
            course,
            section,
            professor,
            capacity,
            enrolled,
            remarks,
          };
          return false;
        }
      }
    });

    if (foundData) {
      console.log(
        `Class Number: ${foundData.classNumber}\nCourse: ${foundData.course}\nSection: ${foundData.section}\nProfessor: ${foundData.professor}\nCapacity: ${foundData.capacity}\nEnrolled: ${foundData.enrolled}\nRemarks: ${foundData.remarks}`
      );
      return { data: foundData };
    } else {
      console.log(`Class number ${classNo} not found.`);
      return { data: null };
    }
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.log("Cookie expired. Fetching a new one...");
      const { cfClearance, userAgent } = await fetchCfClearance();
      return { cfClearance, userAgent };
    } else {
      console.error("Error:", error);
    }
  }
};

module.exports = fetchCourseData;