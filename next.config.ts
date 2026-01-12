import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "rtabajdhhwynskkpyzxv.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
