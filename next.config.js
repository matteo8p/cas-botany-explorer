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
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/en/**",
      },
    ],
  },
};

module.exports = nextConfig;
