import { roomsData } from "../data/roomsData";
import { facilitiesData } from "../data/facilitiesData";

export const dynamic = "force-static";

export default function sitemap() {
  const baseUrl = "https://hoteldevang.com";
  
  // List of all pages on the website
  const routes = [
    { url: "", changeFrequency: "daily", priority: 1.0, images: [`${baseUrl}/Photos/index/Hero4.jpeg`] },
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

  // Add individual room details subpages dynamically
  Object.keys(roomsData).forEach((slug) => {
    const imageUrl = roomsData[slug].image ? `${baseUrl}${roomsData[slug].image}` : null;
    routes.push({ 
      url: `room/${slug}`, 
      changeFrequency: "weekly", 
      priority: 0.85,
      images: imageUrl ? [imageUrl] : undefined
    });
  });

  // Add individual facility details subpages dynamically
  Object.keys(facilitiesData).forEach((slug) => {
    const imageUrl = facilitiesData[slug].image ? `${baseUrl}${facilitiesData[slug].image}` : null;
    routes.push({ 
      url: `facilities/${slug}`, 
      changeFrequency: "monthly", 
      priority: 0.8,
      images: imageUrl ? [imageUrl] : undefined
    });
  });

  return routes.map((route) => ({
    url: `${baseUrl}/${route.url}`.replace(/\/$/, ""), // avoid double slash/trailing slash on root
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    images: route.images,
  }));
}
