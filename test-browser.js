const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const logs = [];
  page.on("console", (msg) => {
    const t = msg.text();
    if (msg.type() === "error" || msg.type() === "warn") logs.push("[console." + msg.type() + "] " + t);
  });
  page.on("pageerror", (err) => logs.push("[pageerror] " + err.message));

  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));

  // Screenshot at top
  await page.screenshot({ path: "s-top.png" });

  // Scroll to middle sections
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: "s-mid.png" });

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: "s-bottom.png" });

  // Full page
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: "s-full.png", fullPage: true });

  const hasHero = await page.evaluate(() => document.body.innerText.includes("TOKO DIGITAL"));
  const noErrors = !logs.some((l) => l.startsWith("[pageerror]"));
  console.log("HAS HERO:", hasHero);
  console.log("NO PAGE ERRORS:", noErrors);
  console.log("=== WARN/ERR LOGS ===");
  logs.forEach((l) => console.log(l));

  await browser.close();
  console.log("DONE");
})().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
