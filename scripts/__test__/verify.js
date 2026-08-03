const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage();
  const requests = [];
  const consoleErrors = [];
  page.on("request", (req) => requests.push(req.url()));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  const filePath = "file://" + path.resolve(__dirname, "out.html");
  await page.goto(filePath);
  await page.waitForTimeout(300);

  const h1 = await page.textContent("h1");
  await page.click("button");
  await page.waitForTimeout(100);
  const counter = await page.textContent("p");

  console.log("Titre h1:", h1);
  console.log("Compteur après clic:", counter);
  console.log("Requêtes réseau (hors file://):", requests.filter((u) => !u.startsWith("file://")));
  console.log("Erreurs console:", consoleErrors);

  await browser.close();
})();
