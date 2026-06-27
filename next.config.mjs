/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Native / heavy modules must stay on the Node side, never bundled for the browser.
  serverExternalPackages: ["better-sqlite3", "sharp", "@imgly/background-removal-node"],
};
export default nextConfig;
