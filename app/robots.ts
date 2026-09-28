import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://aokigahara.dev/sitemap.xml",
    host: "https://aokigahara.dev",
  };
}
