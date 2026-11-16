import RoomsClient from "./RoomsClient";

export const metadata = {
  title: "Deluxe AC Rooms & Family Accommodation in Dwarka | Hotel Devang",
  description: "Choose from 43 well-appointed rooms at Hotel Devang Dwarka. Offering Standard, Deluxe, Super Deluxe, and premium Suites (AC & Non-AC) near Dwarkadhish Temple at affordable tariffs.",
  keywords: "rooms in dwarka, hotel rooms dwarka, deluxe ac room dwarka, family suite dwarka, budget rooms dwarka, hotel devang room price",
  alternates: {
    canonical: "https://hoteldevang.com/room",
  },
  openGraph: {
    title: "Deluxe AC Rooms & Family Accommodation in Dwarka | Hotel Devang",
    description: "Choose from 43 well-appointed rooms at Hotel Devang Dwarka. Offering Standard, Deluxe, Super Deluxe, and premium Suites near Dwarkadhish Temple.",
    url: "https://hoteldevang.com/room",
    type: "website",
    siteName: "Hotel Devang",
    locale: "en_IN",
    images: [
      {
        url: "https://hoteldevang.com/Photos/Rooms/suite.jpeg",
        secureUrl: "https://hoteldevang.com/Photos/Rooms/suite.jpeg",
        width: 1200,
        height: 630,
        alt: "Hotel Devang Luxury Rooms & Family Accommodation in Dwarka",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deluxe AC Rooms & Family Accommodation in Dwarka | Hotel Devang",
    description: "Choose from 43 well-appointed rooms at Hotel Devang Dwarka. Offering Standard, Deluxe, Super Deluxe, and premium Suites near Dwarkadhish Temple.",
    images: ["https://hoteldevang.com/Photos/Rooms/suite.jpeg"],
  },
};

export default function Page() {
  const roomSchema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": "https://hoteldevang.com/#hotel",
    "name": "Hotel Devang",
    "description": "Premium rooms and family accommodations near Dwarkadhish Temple in Dwarka.",
    "url": "https://hoteldevang.com/room",
    "numberOfRooms": "43",
    "petsAllowed": "false",
    "audience": {
      "@type": "Audience",
      "audienceType": "Pilgrims, Families, Tourists"
    },
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Air Conditioning", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Flat-screen TV", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Room Service", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Attached Bathroom", "value": "true" }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roomSchema) }}
      />
      <RoomsClient />
    </>
  );
}
