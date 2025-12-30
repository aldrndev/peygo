import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/private/",
      },
      // Block AI Scrapers & Training Bots
      {
        userAgent: [
          "GPTBot",          // OpenAI
          "CCBot",           // Common Crawl (Used by many AIs)
          "Google-Extended", // Gemini/Bard Training
          "Anthropic-AI",    // Claude
          "Claude-Web",
          "FacebookBot",     // Meta AI
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://peygo.id/sitemap.xml",
  };
}
