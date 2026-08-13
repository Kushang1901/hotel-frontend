export const dynamic = "force-static";

export default function sitemap() {
  const baseUrl = "https://hoteldevang.com";
  
  // List of all pages on the website
  const routes = [
    { url: "", changeFrequency: "daily", priority: 1.0 },
    { url: "about_us", changeFrequency: "monthly", priority: 0.8 },
    { url: "room", changeFrequency: "weekly", priority: 0.9 },
    { url: "facilities", changeFrequency: "monthly", priority: 0.8 },
    { url: "gallery", changeFrequency: "monthly", priority: 0.7 },
    { url: "booking", changeFrequency: "daily", priority: 0.95 },
    { url: "dwarka_attractions", changeFrequency: "monthly", priority: 0.75 },
    { url: "blog", changeFrequency: "weekly", priority: 0.8 },
    { url: "contact", changeFrequency: "monthly", priority: 0.85 },
    { url: "policies", changeFrequency: "monthly", priority: 0.5 },
    { url: "refund", changeFrequency: "monthly", priority: 0.5 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}/${route.url}`.replace(/\/$/, ""), // avoid double slash/trailing slash on root
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
