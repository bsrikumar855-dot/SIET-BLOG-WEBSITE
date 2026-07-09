import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config) => {
    // Exclude the temporary (main) route group folder from compile context to prevent routing conflicts
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /src\/app\/\(main\)/,
      })
    );
    return config;
  },
};

export default nextConfig;

