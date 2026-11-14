// OG 이미지 생성: scripts/og/og-image.html → public/og.png (1200×630)
// 사용법: node scripts/og/generate.cjs [Pretendard .otf 폴더]   (폴더를 주면 CDN 대신 로컬 폰트 사용)
const { chromium } = require("playwright"); // 없으면: npx playwright install chromium
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const here = __dirname;
const fontDir = process.argv[2];

(async () => {

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(here, "og-image.html")).href, { waitUntil: "networkidle" });
if (fontDir) {
  const face = (w, f) =>
    `@font-face{font-family:Pretendard;font-weight:${w};src:url("${pathToFileURL(path.join(fontDir, f)).href}")}`;
  await page.addStyleTag({
    content: [face(400, "Pretendard-Regular.otf"), face(600, "Pretendard-SemiBold.otf"),
      face(700, "Pretendard-Bold.otf"), face(800, "Pretendard-ExtraBold.otf")].join(""),
  });
}
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(here, "../../public/og.png") });
await browser.close();
console.log("✔ public/og.png 생성");
})();
