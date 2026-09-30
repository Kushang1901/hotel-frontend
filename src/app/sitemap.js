import { getDynamicSitemapRoutes } from "../lib/seoConfig";

/**
 * Dynamic Sitemap Handler
 * Generates XML sitemap dynamically based on respected SEO priorities,
 * customizable slugs for rooms, facilities, attractions, and custom registered URLs.
 */
export const revalidate = 3600; // Dynamic revalidation interval (1 hour)

export default function sitemap() {
  const routes = getDynamicSitemapRoutes();

  return routes.map((route) => ({
    url: route.url,
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.images ? { images: route.images } : {}),
    ...(route.alternates ? { alternates: route.alternates } : {}),
  }));
}
