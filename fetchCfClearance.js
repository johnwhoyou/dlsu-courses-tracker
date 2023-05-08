const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');

puppeteer.use(StealthPlugin());

const fetchCfClearance = async () => {
  let cfClearance = null;
  let userAgent = null;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: executablePath(),
    });

    const page = await browser.newPage();

    await page.goto("https://enroll.dlsu.edu.ph/dlsu/view_course_offerings");

    userAgent = await page.evaluate(() => navigator.userAgent);

    // Wait for 5 seconds to allow Cloudflare to set the necessary cookies
    await page.waitForTimeout(5000)

    const cookies = await page.cookies();

    for (const cookie of cookies) {
      if (cookie.name === "cf_clearance") {
        cfClearance = cookie.value;
        break;
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return { cfClearance, userAgent };
};

module.exports = fetchCfClearance;
