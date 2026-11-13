/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static site -> /out, deploy to Cloudflare Pages
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
