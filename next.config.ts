import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/waitlist_refactored",
        destination: "/waitlist",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
