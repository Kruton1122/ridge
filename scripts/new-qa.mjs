// QA sweep for the live site. Not part of any pipeline — run by hand.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.env.RIDGE_BASE ?? "http://127.0.0.1:8098";
const OUT = new URL("../screenshots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["board", "/"],
  ["models", "/models"],
  ["model", "/models/claude-fable-5.1"],
  ["model-unscored", "/models/deepseek-v4.1-flash"],
  ["compare", "/compare?ids=claude-fable-5.1,gpt-6-astra,grok-4.6"],
  ["benchmarks", "/benchmarks"],
  ["benchmark", "/benchmarks/aa-intelligence"],
  ["labs", "/labs"],
  ["lab", "/labs/anthropic"],
  ["news", "/news"],
  ["note", "/news/astra-v42"],
  ["methodology", "/methodology"],
  ["changelog", "/changelog"],
  ["api", "/api"],
];

const VIEWPORTS = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
];

const problems = [];

/**
 * Check the site the way the internet reaches it, not just the way the dev
 * server does.
 *
 * nginx's dotfile guard (`location ~ /\.`) matched Vite's `/node_modules/.vite/`
 * dependency directory and returned 403 for React itself. Nothing hydrated, so
 * every button on ridgebench.com was dead — while every localhost check passed,
 * because localhost bypasses nginx entirely. Assert through the proxy.
 */
async function checkThroughProxy() {
  const PROXY = process.env.RIDGE_PROXY ?? "http://127.0.0.1:8099";
  const HOST = process.env.RIDGE_HOST ?? "ridgebench.com";
  const mustLoad = [
    "/node_modules/.vite/deps/react.js",
    "/node_modules/.vite/deps/react-dom_client.js",
    "/@vite/client",
    "/",
  ];
  const mustDeny = ["/.env", "/.git/config"];

  for (const path of mustLoad) {
    const res = await fetch(PROXY + path, { headers: { Host: HOST } }).catch(() => null);
    if (!res || res.status >= 400) {
      problems.push(`[proxy] ${path} returns ${res?.status ?? "no response"} through nginx — the client bundle will not load`);
    }
  }
  for (const path of mustDeny) {
    const res = await fetch(PROXY + path, { headers: { Host: HOST } }).catch(() => null);
    if (res && res.status !== 403) {
      problems.push(`[proxy] ${path} is not denied (${res.status}) — the dotfile guard has been weakened too far`);
    }
  }
}

await checkThroughProxy();

async function checkRedirectsAndArchive() {
  const cases = [
    ["/new", "/"],
    ["/new/models/claude-fable-5.1", "/models/claude-fable-5.1"],
    ["/source", "/api"],
  ];
  for (const [from, expect] of cases) {
    const res = await fetch(BASE + from, { redirect: "follow" }).catch(() => null);
    const url = res?.url ?? "";
    if (!res || res.status >= 400 || !url.includes(expect)) {
      problems.push(`[redirect] ${from} did not land on ${expect} (got ${res?.status ?? "no response"} ${url})`);
    }
  }
  const archive = await fetch(BASE + "/old").catch(() => null);
  if (!archive || archive.status >= 400) {
    problems.push(`[archive] /old returns ${archive?.status ?? "no response"}`);
  }
  const json = await fetch(BASE + "/api/ledger.json").catch(() => null);
  const type = json?.headers.get("content-type") ?? "";
  if (!json || json.status >= 400 || !type.includes("json")) {
    problems.push(`[api] /api/ledger.json is not JSON (${json?.status ?? "no response"} ${type})`);
  }
}

await checkRedirectsAndArchive();

// The Pi already has a system Chromium; skip Playwright's own download.
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/usr/bin/chromium",
});

for (const [vpName, viewport] of VIEWPORTS) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();

  page.on("console", (msg) => {
    if (msg.type() !== "error" && msg.type() !== "warning") return;
    const text = msg.text();
    // Vite dev noise that says nothing about the page itself.
    if (/vite|hmr|Download the React DevTools/i.test(text)) return;
    problems.push(`[console ${msg.type()}] ${vpName} ${page.url()} :: ${text}`);
  });
  page.on("pageerror", (err) => {
    problems.push(`[pageerror] ${vpName} ${page.url()} :: ${err.message}`);
  });
  page.on("requestfailed", (req) => {
    problems.push(`[requestfailed] ${vpName} ${req.url()} :: ${req.failure()?.errorText}`);
  });

  for (const [name, path] of PAGES) {
    const res = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
    if (!res || res.status() >= 400) {
      problems.push(`[http ${res?.status()}] ${vpName} ${path}`);
      continue;
    }

    // Routes that normalize their search params navigate again on mount; let
    // that settle before evaluating anything against the page.
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(150);

    // Horizontal overflow is the classic mobile failure.
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return { scroll: de.scrollWidth, client: de.clientWidth };
    });
    if (overflow.scroll > overflow.client + 1) {
      problems.push(
        `[overflow] ${vpName} ${path} :: scrollWidth ${overflow.scroll} > clientWidth ${overflow.client}`,
      );
    }

    // Every page should render a real h1.
    const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim() ?? "");
    if (!h1) problems.push(`[no-h1] ${vpName} ${path}`);

    // Content must never be gated behind a scroll position. A scroll-driven
    // reveal once held every off-screen section at opacity 0 here; this catches
    // that whole class of bug without needing to eyeball a screenshot.
    // Let reveal animations finish first — sampling mid-flight reads opacity 0
    // on an element that is about to be perfectly visible.
    await page.waitForTimeout(500);
    await page
      .waitForFunction(
        () => document.getAnimations().every((a) => a.playState === "finished"),
        null,
        { timeout: 6000 },
      )
      .catch(() => {});

    const invisible = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("main *")) {
        const text = el.textContent?.trim() ?? "";
        if (text.length < 20) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || Number(cs.opacity) < 0.05) {
          out.push(text.slice(0, 40));
        }
      }
      return [...new Set(out)].slice(0, 4);
    });
    if (invisible.length) {
      problems.push(`[invisible-content] ${vpName} ${path} :: ${invisible.join(" | ")}`);
    }

    // Tap targets on mobile.
    if (vpName === "mobile") {
      const small = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("a, button")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.height < 24) out.push((el.textContent ?? "").trim().slice(0, 32) || el.tagName);
        }
        return [...new Set(out)].slice(0, 6);
      }).catch(() => []);
      if (small.length) problems.push(`[tap-target <24px] ${path} :: ${small.join(" | ")}`);
    }

    await page.screenshot({
      path: `${OUT}${vpName}-${name}.png`,
      fullPage: vpName === "desktop",
    });
  }

  await context.close();
}

// Interaction pass: sort, filter, column expand, command palette.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on("pageerror", (err) => problems.push(`[pageerror interact] ${err.message}`));

  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const firstBefore = await page.evaluate(
    () => document.querySelector("tbody tr td a")?.textContent?.trim() ?? "",
  );

  await page.getByRole("button", { name: /\$\/AA/ }).first().click();
  const sorted = await page
    .waitForFunction(
      (before) => document.querySelector("tbody tr td a")?.textContent?.trim() !== before,
      firstBefore,
      { timeout: 15000 },
    )
    .then(() => true)
    .catch(() => false);
  if (!sorted) {
    problems.push(`[sort] clicking $/AA did not change the leading row (${firstBefore})`);
  }
  await page.screenshot({ path: `${OUT}interact-sorted.png` });

  const colsBefore = await page.evaluate(() => document.querySelectorAll("thead th").length);
  await page.getByRole("button", { name: "More fields" }).click();
  const widened = await page
    .waitForFunction(
      (n) => document.querySelectorAll("thead th").length > n,
      colsBefore,
      { timeout: 15000 },
    )
    .then(() => true)
    .catch(() => false);
  const cols = await page.evaluate(() => document.querySelectorAll("thead th").length);
  if (!widened) problems.push(`[columns] "More fields" did not add columns (still ${cols})`);

  await page.getByRole("button", { name: "Open" }).first().click();
  await page.waitForTimeout(250);
  const openRows = await page.evaluate(() => document.querySelectorAll("tbody tr").length);
  if (openRows === 0) problems.push("[filter] open-weights filter emptied the table");
  await page.screenshot({ path: `${OUT}interact-filtered.png` });

  await page.keyboard.press("Control+k");
  await page.waitForTimeout(400);
  const paletteOpen = await page.evaluate(() => Boolean(document.querySelector("[cmdk-root]")));
  if (!paletteOpen) problems.push("[palette] Ctrl-K did not open the command palette");
  else {
    await page.keyboard.type("astra");
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}interact-palette.png` });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(700);
    if (!page.url().includes("/models/")) {
      problems.push(`[palette] Enter did not navigate to a model (${page.url()})`);
    }
  }

  await context.close();
}

/**
 * Mobile interaction pass.
 *
 * The viewport-only sweep above missed three real iPhone bugs: bars hidden
 * below the `sm` breakpoint, sort silently dead because the state update lived
 * inside a View Transition that Safari would not run, and a nine-column table
 * reduced to a two-inch sliver. A resized desktop browser is not a phone —
 * emulate touch and a coarse pointer, and actually press things.
 */
{
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  page.on("pageerror", (err) => problems.push(`[pageerror mobile] ${err.message}`));

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  const bars = await page.evaluate(
    () => [...document.querySelectorAll(".n-bar")].filter((b) => b.getBoundingClientRect().width > 0).length,
  );
  if (bars === 0) problems.push("[mobile] no magnitude bars render in portrait");

  const cards = await page.evaluate(() => document.querySelectorAll('[data-testid="ledger-cards"] > li').length);
  if (cards === 0) problems.push("[mobile] ledger renders no cards at 393px");

  const leadBefore = await page.evaluate(
    () => document.querySelector('[data-testid="ledger-cards"] li a p')?.textContent?.trim() ?? "",
  );
  await page.selectOption("select", "dollarPerAa");
  const reordered = await page
    .waitForFunction(
      (before) =>
        document.querySelector('[data-testid="ledger-cards"] li a p')?.textContent?.trim() !== before,
      leadBefore,
      { timeout: 15000 },
    )
    .then(() => true)
    .catch(() => false);
  if (!reordered) {
    problems.push(`[mobile] sort select did not reorder the ledger (${leadBefore})`);
  }

  const all = await page.evaluate(() => document.querySelectorAll('[data-testid="ledger-cards"] > li').length);
  await page.getByRole("button", { name: "Open", exact: true }).first().click();
  await page
    .waitForFunction(
      (n) => document.querySelectorAll('[data-testid="ledger-cards"] > li').length < n,
      all,
      { timeout: 15000 },
    )
    .catch(() => {});
  const open = await page.evaluate(() => document.querySelectorAll('[data-testid="ledger-cards"] > li').length);
  if (!(open > 0 && open < all)) {
    problems.push(`[mobile] open-weights filter did not narrow the ledger (${all} -> ${open})`);
  }

  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  if (overflow.scroll > overflow.client + 1) {
    problems.push(`[mobile] page overflows horizontally (${overflow.scroll} > ${overflow.client})`);
  }

  await page.screenshot({ path: `${OUT}iphone-ledger.png` });

  // Data tables must collapse to cards on a phone. The comparison matrix is the
  // one exception — it is genuinely two-dimensional, so it keeps a scrolling
  // table with a frozen metric column.
  for (const path of ["/", "/benchmarks/aa-intelligence", "/labs/anthropic", "/models"]) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const visibleTables = await page.evaluate(
      () =>
        [...document.querySelectorAll("table")].filter(
          (t) => t.getBoundingClientRect().width > 0,
        ).length,
    );
    if (visibleTables > 0) {
      problems.push(`[mobile] ${path} still renders a data table at 393px`);
    }

    // Any element wider than the viewport that is not an intentional scroller.
    const clipped = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("main *")) {
        const r = el.getBoundingClientRect();
        if (r.width <= window.innerWidth + 1) continue;
        const scroller = el.closest("[class*='overflow-x-auto']");
        if (scroller && scroller !== el) continue;
        out.push((el.className || el.tagName).toString().slice(0, 48));
      }
      return [...new Set(out)].slice(0, 3);
    });
    if (clipped.length) {
      problems.push(`[mobile] ${path} has content wider than the viewport :: ${clipped.join(" | ")}`);
    }
  }

  await context.close();
}

await browser.close();

if (problems.length === 0) {
  console.log("QA PASS — no problems found");
} else {
  console.log(`QA FOUND ${problems.length} PROBLEM(S):\n`);
  for (const p of problems) console.log(" - " + p);
}
console.log(`\nScreenshots: ${OUT}`);
