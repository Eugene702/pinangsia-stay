import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/auth",
      destination: "/auth/signin",
      permanent: false
    }
  ]
};

export default nextConfig;
