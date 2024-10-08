const puppeteer = require('puppeteer');

(async () => {
  const profile = {
    name: "Profile with Proxy",
    proxy: "http://bultau2y:KRnFAMWyQQlR@13t9mmnc2.proxy7773.cloud:3129",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  };

  const launchOptions = {
    headless: false,
    args: [
      "--hide-crash-restore-bubble",
      "--no-sandbox",
      `--window-size=1200,800`,
    ],
  };

  // Nếu có proxy, thêm vào args trước khi khởi tạo Puppeteer
  if (profile.proxy) {
    const { username, password, origin: proxyOrigin } = new URL(profile.proxy);
    launchOptions.args.push(`--proxy-server=${proxyOrigin}`);
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // Thiết lập xác thực proxy nếu cần
  if (profile.proxy) {
    const { username, password } = new URL(profile.proxy);
    await page.authenticate({ username, password });
  }

  // Thiết lập User-Agent nếu có
  if (profile.userAgent) {
    await page.setUserAgent(profile.userAgent);
  }

  // Truy cập trang để kiểm tra IP
  await page.goto('https://iphey.com');

  // Lấy và in ra IP đang sử dụng
  const ipInfo = await page.evaluate(() => {
    return document.querySelector('h1').innerText;
  });

  console.log(`IP hiện tại của trình duyệt là: ${ipInfo}`);

//   await browser.close();
})();
