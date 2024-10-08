const puppeteer = require("puppeteer");
const path = require("path");
const { getConfig, sleep } = require("../utils/helpers");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

async function launchCustomBrowser(
  profileKey,
  x,
  y,
  windowWidth,
  windowHeight,
  url
) {
  const config = getConfig();
  const profile = config.profiles[profileKey];

  if (!profile) {
    throw new Error(`Profile "${profileKey}" không tồn tại.`);
  }

  console.log("Profile:", profile);
  console.log("Profile Name:", profile.name);

  const userDataDir = path.join(__dirname, "../../profiles", profileKey);
  const launchOptions = {
    headless: false,
    args: [
      "--hide-crash-restore-bubble",
      `--user-data-dir=${userDataDir}`,
      `--window-size=${windowWidth},${windowHeight}`,
      `--window-position=${x},${y}`,
      "--no-sandbox",
    ],
  };

  if (profile.proxy) {
    const { origin: proxyOrigin } = new URL(profile.proxy);
    launchOptions.args.push(`--proxy-server=${proxyOrigin}`);
  }
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: windowWidth, height: windowHeight });
  if (profile.proxy) {
    const { username, password } = new URL(profile.proxy);
    await page.authenticate({ username, password });
    
  }
  if (profile.userAgent) {
    await page.setUserAgent(profile.userAgent);
  }

  console.log(
    `Chrome profile "${profile.name}" đang chạy với ip: ${await getIP(profile.proxy) || `Chrome profile ${profile.name} Không có proxy`
    }`
  );

  await loadPage(page, url);
  return browser;
}

async function loadPage(page, url) {
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    await sleep(2000);
    console.log(`Đang truy cập ${url}`);
    // Giả lập nhập thông tin vào các trường (nếu cần)
    await page.type("#basic_user", "qhuy.dev@gmail.com");
    await page.type("#basic_password", "19102003Huydev@");
  } catch (err) {
    console.error(`Lỗi khi truy cập trang: ${err.message}`);
  }
}

async function getIP(proxy) {
  try {
    const response = await axios.get("https://api.ipify.org?format=json", {
      httpsAgent: new HttpsProxyAgent(proxy),
    });
    return response.data.ip;
  } catch (error) {
    console.log("Lỗi khi lấy IP:", error.message);
  }
}
module.exports = { launchCustomBrowser };
