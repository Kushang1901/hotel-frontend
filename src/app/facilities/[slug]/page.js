import FacilityDetailClient from "./FacilityDetailClient";
import { facilitiesData } from "../../../data/facilitiesData";

// Pre-render these 6 routes at build time (required for output: 'export')
export async function generateStaticParams() {
  return Object.keys(facilitiesData).map((slug) => ({
    slug: slug,
  }));
}

// Generate dynamic SEO metadata for each facility page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const facility = facilitiesData[slug];

  if (!facility) {
    return {
      title: "Venue Not Found | Hotel Devang Dwarka",
      description: "The requested event venue could not be found.",
    };
  }

  const title = `${facility.title} | Event Venue in Dwarka | Hotel Devang`;
  const description = `${facility.desc.substring(0, 150)}... Book ${facility.title} for weddings, dhwaja ceremonies, and spiritual events in Dwarka. Seating: ${facility.seating}, Area: ${facility.area}.`;
  const canonicalUrl = `https://hoteldevang.com/facilities/${slug}`;

  return {
    title,
    description,
    keywords: `${facility.title.toLowerCase()}, wedding lawn dwarka, event hall dwarka, banquet hall hotel devang, dwarka marriage venue`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: facility.image,
          alt: facility.title,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const facility = facilitiesData[slug];

  if (!facility) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center", background: "#fdf8f1" }}>
        <h1 style={{ fontFamily: "serif", color: "#880000" }}>Venue Not Found</h1>
        <p>The requested facility venue does not exist.</p>
      </div>
    );
  }

  // Schema markup for EventVenue
  const venueSchema = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": `https://hoteldevang.com/facilities/${slug}#venue`,
    "name": facility.title,
    "description": facility.desc,
    "image": facility.image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Dwarkadhish Temple",
      "addressLocality": "Dwarka",
      "addressRegion": "Gujarat",
      "postalCode": "361335",
      "addressCountry": "IN"
    },
    "telephone": "+919824402132",
    "amenityFeature": facility.features.map(feat => ({
      "@type": "LocationFeatureSpecification",
      "name": feat,
      "value": "true"
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueSchema) }}
      />
      <FacilityDetailClient facility={facility} slug={slug} />
    </>
  );
}
