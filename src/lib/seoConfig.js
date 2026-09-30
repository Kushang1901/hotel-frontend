import { roomsData } from "../data/roomsData";
import { facilitiesData } from "../data/facilitiesData";
import { attractionsData } from "../data/attractionsData";
import { blogData } from "../data/blogData";

export const BASE_URL = "https://hoteldevang.com";

/**
 * Respected SEO Priority Hierarchy
 * Weighted strategically according to commercial intent and search discovery value.
 */
export const SEO_PRIORITY = {
  HOME: 1.0,           // Flagship landing & domain authority
  BOOKING: 0.95,       // Primary conversion funnel & reservation intent
  ROOMS_INDEX: 0.90,   // Accommodation hub
  ROOM_VIP: 0.90,      // High-margin suites (e.g. Suite AC)
  ROOM_PREMIUM: 0.88,  // Popular & luxury rooms (Deluxe AC, Super Deluxe AC)
  ROOM_STANDARD: 0.85, // Standard room categories
  FACILITIES_INDEX: 0.80, // Event halls & wedding lawns hub
  FACILITY_DETAIL: 0.75,  // Individual event venues & party plots
  ATTRACTIONS: 0.80,   // Dwarka pilgrimage & tourism guide hub
  BLOG_INDEX: 0.80,    // Travel & pilgrim blog directory
  BLOG_POST: 0.75,     // Individual travel articles & guides
  CONTACT: 0.85,       // Contact, location map & customer support
  ABOUT: 0.75,         // Hotel heritage & founder story
  GALLERY: 0.70,       // Visual photo gallery
  POLICY: 0.50,        // Operational & legal compliance pages
};

export const CHANGE_FREQUENCY = {
  ALWAYS: "always",
  HOURLY: "hourly",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
  NEVER: "never",
};

/**
 * Normalizes and sanitizes any given slug into a clean, URL-safe format.
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Preserves allowed characters (letters, numbers, hyphens, and underscores for existing Next.js routes)
 * - Trims leading and trailing hyphens/slashes
 */
export function formatSlug(rawSlug, { allowUnderscore = true } = {}) {
  if (!rawSlug && rawSlug !== 0) return "";
  let formatted = String(rawSlug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, ""); // Strip leading/trailing slashes

  if (allowUnderscore) {
    formatted = formatted
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/-+/g, "-");
  } else {
    formatted = formatted
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
  }
  return formatted.replace(/^-+|-+$/g, "");
}

/**
 * Custom route builder for any new or existing URL in the sitemap.
 * Guarantees proper URL formatting, slug customization, respected priority, and image tags.
 */
export function createSitemapItem({
  slug = "",
  prefix = "",
  customPath = null,
  priority = SEO_PRIORITY.POLICY,
  changeFrequency = CHANGE_FREQUENCY.MONTHLY,
  lastModified = new Date(),
  images = [],
  alternates = undefined,
  schemaType = "WebPage"
} = {}) {
  let relativePath = "";

  if (customPath !== null && customPath !== undefined) {
    relativePath = String(customPath).trim().replace(/^\/+|\/+$/g, "");
  } else {
    const cleanPrefix = formatSlug(prefix);
    const cleanSlug = formatSlug(slug);
    relativePath = [cleanPrefix, cleanSlug].filter(Boolean).join("/");
  }

  const resolvedUrl = relativePath ? `${BASE_URL}/${relativePath}` : BASE_URL;

  // Resolve absolute image URLs for Google Image Sitemap specifications
  const formattedImages = Array.isArray(images) && images.length > 0
    ? images
        .filter(Boolean)
        .map((img) => (img.startsWith("http") ? img : `${BASE_URL}${img.startsWith("/") ? "" : "/"}${img}`))
    : undefined;

  // Ensure priority stays within valid XML sitemap range [0.0 - 1.0]
  const numericPriority = Math.min(1.0, Math.max(0.1, Number(priority) || 0.5));

  return {
    url: resolvedUrl,
    path: `/${relativePath}`,
    slug: formatSlug(slug) || (relativePath ? relativePath.split("/").pop() : "home"),
    priority: Number(numericPriority.toFixed(2)),
    changeFrequency,
    lastModified: lastModified instanceof Date ? lastModified : new Date(lastModified || Date.now()),
    ...(formattedImages ? { images: formattedImages } : {}),
    ...(alternates ? { alternates } : {}),
    schemaType
  };
}

// In-memory registry for user-customizable dynamic routes
const customRegisteredRoutes = [];

/**
 * Register any new custom URL with a customized slug and respected priority.
 * Example:
 * registerCustomRoute({
 *   slug: "special-diwali-offer",
 *   prefix: "offers",
 *   priority: 0.85,
 *   changeFrequency: "weekly",
 *   images: ["/Photos/index/offer.png"]
 * });
 */
export function registerCustomRoute(routeOptions) {
  const item = createSitemapItem(routeOptions);
  customRegisteredRoutes.push(item);
  return item;
}

/**
 * Core static site pages with respected priorities & images
 */
export const corePagesConfig = [
  {
    slug: "",
    customPath: "",
    priority: SEO_PRIORITY.HOME,
    changeFrequency: CHANGE_FREQUENCY.DAILY,
    images: ["/Photos/index/Hero4.jpeg"],
    schemaType: "Hotel"
  },
  {
    slug: "booking",
    customPath: "booking",
    priority: SEO_PRIORITY.BOOKING,
    changeFrequency: CHANGE_FREQUENCY.DAILY,
    images: ["/Photos/index/Hero4.jpeg"],
    schemaType: "ReservationPage"
  },
  {
    slug: "room",
    customPath: "room",
    priority: SEO_PRIORITY.ROOMS_INDEX,
    changeFrequency: CHANGE_FREQUENCY.WEEKLY,
    images: ["/Photos/Rooms/suite.jpeg", "/Photos/Rooms/deluxe_ac.jpeg"],
    schemaType: "ItemPage"
  },
  {
    slug: "facilities",
    customPath: "facilities",
    priority: SEO_PRIORITY.FACILITIES_INDEX,
    changeFrequency: CHANGE_FREQUENCY.MONTHLY,
    images: ["/Photos/Facilities/TH.jpeg", "/Photos/Facilities/G1.jpeg"],
    schemaType: "ItemPage"
  },
  {
    slug: "dwarka_attractions",
    customPath: "dwarka_attractions",
    priority: SEO_PRIORITY.ATTRACTIONS,
    changeFrequency: CHANGE_FREQUENCY.WEEKLY,
    images: ["/Photos/index/dwarka1.png", "/Photos/index/beytdwarka.png"],
    schemaType: "Guide"
  },
  {
    slug: "blog",
    customPath: "blog",
    priority: SEO_PRIORITY.BLOG_INDEX,
    changeFrequency: CHANGE_FREQUENCY.WEEKLY,
    images: ["/Photos/index/blog.png"],
    schemaType: "Blog"
  },
  {
    slug: "about_us",
    customPath: "about_us",
    priority: SEO_PRIORITY.ABOUT,
    changeFrequency: CHANGE_FREQUENCY.MONTHLY,
    images: ["/Photos/index/hotel_front.jpeg"],
    schemaType: "AboutPage"
  },
  {
    slug: "contact",
    customPath: "contact",
    priority: SEO_PRIORITY.CONTACT,
    changeFrequency: CHANGE_FREQUENCY.MONTHLY,
    schemaType: "ContactPage"
  },
  {
    slug: "gallery",
    customPath: "gallery",
    priority: SEO_PRIORITY.GALLERY,
    changeFrequency: CHANGE_FREQUENCY.MONTHLY,
    images: ["/Photos/index/Hero4.jpeg"],
    schemaType: "ImageGallery"
  },
  {
    slug: "policies",
    customPath: "policies",
    priority: SEO_PRIORITY.POLICY,
    changeFrequency: CHANGE_FREQUENCY.MONTHLY,
    schemaType: "WebPage"
  },
  {
    slug: "refund",
    customPath: "refund",
    priority: SEO_PRIORITY.POLICY,
    changeFrequency: CHANGE_FREQUENCY.MONTHLY,
    schemaType: "WebPage"
  }
];

/**
 * Dynamically aggregates all routes (core pages, rooms, facilities, attractions, blogs, and custom routes)
 * with their respected priority and customizable slugs.
 */
export function getDynamicSitemapRoutes() {
  const dynamicRoutes = [];

  // 1. Process Core Pages
  corePagesConfig.forEach((page) => {
    dynamicRoutes.push(createSitemapItem(page));
  });

  // 2. Dynamic Room Subpages with respected priority & customizable slug
  Object.keys(roomsData).forEach((key) => {
    const room = roomsData[key];
    const customizedSlug = formatSlug(room.slug || key);
    const roomPriority = room.priority || (customizedSlug === "suite-ac" ? SEO_PRIORITY.ROOM_VIP : SEO_PRIORITY.ROOM_STANDARD);

    dynamicRoutes.push(
      createSitemapItem({
        slug: customizedSlug,
        prefix: "room",
        priority: roomPriority,
        changeFrequency: room.changeFrequency || CHANGE_FREQUENCY.WEEKLY,
        images: room.image ? [room.image] : [],
        schemaType: "HotelRoom"
      })
    );
  });

  // 3. Dynamic Facility Subpages with respected priority & customizable slug
  Object.keys(facilitiesData).forEach((key) => {
    const facility = facilitiesData[key];
    const customizedSlug = formatSlug(facility.slug || key);
    const facilityPriority = facility.priority || SEO_PRIORITY.FACILITY_DETAIL;

    dynamicRoutes.push(
      createSitemapItem({
        slug: customizedSlug,
        prefix: "facilities",
        priority: facilityPriority,
        changeFrequency: facility.changeFrequency || CHANGE_FREQUENCY.MONTHLY,
        images: facility.image ? [facility.image] : (facility.photos || []),
        schemaType: "EventVenue"
      })
    );
  });

  // 4. Dynamic Registered Custom Routes
  customRegisteredRoutes.forEach((route) => {
    dynamicRoutes.push(route);
  });

  return dynamicRoutes;
}
