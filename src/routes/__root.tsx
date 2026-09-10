import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { BootCover } from "@/components/boot-cover";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Ridge";

/** Critical boot-cover CSS so the overlay paints before styles.css arrives. */
const BOOT_CRITICAL_CSS = `#ridge-boot{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:#07111c;color:#e8eef4}#ridge-boot .ridge-boot__inner{display:flex;flex-direction:column;align-items:center;gap:14px}#ridge-boot .ridge-boot__word{font-family:Georgia,serif;font-size:22px;letter-spacing:-0.02em}html[data-boot="ready"] #ridge-boot,.ridge-boot--exit{opacity:0;visibility:hidden;pointer-events:none}`;

function publicShareHost(): string {
  const raw = process.env.VITE_PUBLIC_HOSTNAME ?? "";
  const host = raw.replace(/^https?:\/\//, "").split("/")[0].split(":")[0].toLowerCase();
  if (!host || !host.includes(".")) return "";
  if (host.endsWith(".vercel.app") || host.endsWith(".vercel.com")) return "";
  return host;
}

const host = publicShareHost();
const xBanner = host ? `https://${host}/x-banner.jpg` : "";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#07111c" },
      { name: "description", content: "The frontier, scored." },
      ...(xBanner ? [{ property: "x:game:image", content: xBanner }] : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=2" },
      { rel: "stylesheet", href: appCss },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Source+Sans+3:wght@400;500;600&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
    styles: [{ children: BOOT_CRITICAL_CSS }],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <style>{`#ridge-boot{display:none!important}html,body{overflow:auto!important}`}</style>
        </noscript>
        <BootCover />
        <div id="ridge-app" className="ridge-app">
          <PreviewHostBridge />
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </div>
        <Scripts />
      </body>
    </html>
  ),
});
