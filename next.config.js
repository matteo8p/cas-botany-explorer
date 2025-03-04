/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "ibss-images.calacademy.org",
        port: "",
        pathname: "/fileget/**",
      },
    ],
  },
};

module.exports = nextConfig;
