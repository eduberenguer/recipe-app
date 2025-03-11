import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/create-recipes",
        destination: "/create.recipes",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
