import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/create-recipes",
        destination: "/create.recipes",
        permanent: true,
      },
      {
        source: "/personal-chef",
        destination: "/personal.chef",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["images.unsplash.com", "images.pexels.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/files/**",
      },
      {
        protocol: "https",
        hostname: "tu-pocketbase.com",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;
