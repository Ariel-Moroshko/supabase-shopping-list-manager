/** @type {import('next').NextConfig} */
const nextConfig = {};

const withSerwist = require("@serwist/next").default({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

module.exports = withSerwist(
  // Your Next.js config
  nextConfig,
);
