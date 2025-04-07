import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  redirects: async () => [
    {
      source: "/auth",
      destination: "/auth/signin",
      permanent: false
    }
  ],
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

export default nextConfig;
