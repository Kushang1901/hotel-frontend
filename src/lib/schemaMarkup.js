import { BASE_URL, formatSlug } from "./seoConfig";

/**
 * Common Hotel Entity Schema
 */
export function generateHotelSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${BASE_URL}/#hotel`,
    "name": "Hotel Devang",
    "url": BASE_URL,
    "image": `${BASE_URL}/Photos/index/Hero4.jpeg`,
    "description": "Hotel Devang offers comfortable AC & Non-AC rooms, spiritual ambience, event lawns, and family stays near Dwarkadhish Temple in Dwarka.",
    "priceRange": "₹1200 - ₹3000",
    "email": "info@hoteldevang.com",
    "telephone": "+919824402132",
    "hasMap": "https://maps.app.goo.gl/PziUhtuH21JubEcj7",
    "starRating": {
      "@type": "Rating",
      "ratingValue": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.2",
      "reviewCount": "150"
    },
    "openingHours": "Mo-Su 00:00-24:00",
    "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Mobile Payment",
    "currenciesAccepted": "INR",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp. Circuit House, Hospital Road",
      "addressLocality": "Dwarka",
      "addressRegion": "Gujarat",
      "postalCode": "361335",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.2442,
      "longitude": 68.9685
    }
  };
}

/**
 * Generates Schema.org BreadcrumbList markup
 * Accepts items like: [{ name: "Home", slug: "" }, { name: "Rooms", slug: "room" }, { name: "Suite AC", slug: "room/suite-ac" }]
 */
export function generateBreadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => {
      const cleanSlug = item.slug ? String(item.slug).replace(/^\/+|\/+$/g, "") : "";
      const itemUrl = cleanSlug ? `${BASE_URL}/${cleanSlug}` : BASE_URL;

      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": itemUrl
      };
    })
  };
}

/**
 * Generates Schema.org HotelRoom markup for customizable room slugs
 */
export function generateRoomSchema(room, rawSlug) {
  if (!room) return null;
  const slug = formatSlug(rawSlug || room.slug || room.id);
  const roomUrl = `${BASE_URL}/room/${slug}`;
  const imageUrl = room.image ? (room.image.startsWith("http") ? room.image : `${BASE_URL}${room.image}`) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": `${roomUrl}#room`,
    "name": room.title,
    "description": room.description,
    "url": roomUrl,
    ...(imageUrl ? { "image": imageUrl } : {}),
    "numberOfBedrooms": 1,
    "occupancy": {
      "@type": "QuantitativeValue",
      "value": room.subtype?.includes("Suite") ? 4 : 2,
      "unitText": "persons"
    },
    "amenityFeature": (room.amenities || []).map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      "name": typeof amenity === "string" ? amenity : amenity.name,
      "value": "true"
    })),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": room.defaultPrice || 1500,
      "availability": "https://schema.org/InStock",
      "url": `${BASE_URL}/booking`,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": room.defaultPrice || 1500,
        "priceCurrency": "INR",
        "unitText": "night"
      }
    },
    "containedInPlace": {
      "@type": "Hotel",
      "name": "Hotel Devang",
      "url": BASE_URL
    }
  };
}

/**
 * Generates Schema.org EventVenue markup for customizable facility slugs
 */
export function generateFacilitySchema(facility, rawSlug) {
  if (!facility) return null;
  const slug = formatSlug(rawSlug || facility.slug);
  const venueUrl = `${BASE_URL}/facilities/${slug}`;
  const imageUrl = facility.image ? (facility.image.startsWith("http") ? facility.image : `${BASE_URL}${facility.image}`) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": `${venueUrl}#venue`,
    "name": facility.title,
    "description": facility.desc,
    "url": venueUrl,
    ...(imageUrl ? { "image": imageUrl } : {}),
    "maximumAttendeeCapacity": parseInt(facility.floating) || parseInt(facility.seating) || 200,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp. Circuit House, Hospital Road",
      "addressLocality": "Dwarka",
      "addressRegion": "Gujarat",
      "postalCode": "361335",
      "addressCountry": "IN"
    },
    "telephone": "+919824402132",
    "amenityFeature": (facility.features || []).map((feat) => ({
      "@type": "LocationFeatureSpecification",
      "name": feat,
      "value": "true"
    }))
  };
}

/**
 * Generates Schema.org TouristAttraction / ItemList markup for Dwarka attractions
 */
export function generateAttractionsSchema(attractions = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}/dwarka_attractions#attractions-list`,
    "name": "Sacred Places & Top Tourist Attractions of Dwarka",
    "description": "Comprehensive pilgrim guide and sightseeing attractions in Dwarka near Hotel Devang.",
    "url": `${BASE_URL}/dwarka_attractions`,
    "numberOfItems": attractions.length,
    "itemListElement": attractions.map((att, index) => {
      const attSlug = formatSlug(att.slug || att.id);
      const imageUrl = att.image ? (att.image.startsWith("http") ? att.image : `${BASE_URL}${att.image}`) : undefined;

      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "TouristAttraction",
          "@id": `${BASE_URL}/dwarka_attractions#${attSlug}`,
          "name": att.title,
          "description": att.desc,
          ...(imageUrl ? { "image": imageUrl } : {}),
          "touristType": ["Pilgrims", "Spiritual Travelers", "Families"],
          "isAccessibleForFree": true,
          "publicAccess": true
        }
      };
    })
  };
}

/**
 * Generates Schema.org BlogPosting markup
 */
export function generateBlogPostingSchema(post, rawSlug) {
  if (!post) return null;
  const slug = formatSlug(rawSlug || post.slug || post.id);
  const postUrl = `${BASE_URL}/blog`;
  const imageUrl = post.image ? (post.image.startsWith("http") ? post.image : `${BASE_URL}${post.image}`) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#${slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    },
    "headline": post.headline || post.title,
    "description": post.description,
    ...(imageUrl ? { "image": imageUrl } : {}),
    "datePublished": post.datePublished || "2026-08-15",
    "dateModified": post.dateModified || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": post.author || "Hotel Devang Team",
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hotel Devang",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/Photos/index/logo.png`
      }
    }
  };
}
