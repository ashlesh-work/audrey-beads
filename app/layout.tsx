import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audrey's Beads — Handmade Bracelets Made With Love",
  description:
    "Handmade beaded bracelets by Audrey, age 11. Custom colors, one of a kind. Order online or visit the stall!",
};

// Runs before paint to set the theme and avoid a flash of the wrong colors.
const themeScript = `(function(){try{var s=localStorage.getItem('theme')||'light';var d=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=(s==='system')?d:s;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
