/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.learningenvironments.unsw.edu.au",
        port: "",
        pathname: "/sites/default/files/styles/teaser_desktop/public/images/**",
      },
    ],
  },
};

export default config;
