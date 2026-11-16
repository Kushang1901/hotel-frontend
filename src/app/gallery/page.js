import GalleryClient from "./GalleryClient";

export const metadata = {
  title: "Photo Gallery – Rooms, Banquet Halls & Entrance | Hotel Devang",
  description: "Take a visual tour of Hotel Devang. Browse photos of our Deluxe AC family rooms, spacious banquet halls, modern reception lobby, dining area, and facilities in Dwarka.",
  keywords: "hotel devang photos, hotel gallery dwarka, rooms photos dwarka, banquet hall photos dwarka",
  alternates: {
    canonical: "https://hoteldevang.com/gallery",
  },
  openGraph: {
    title: "Photo Gallery – Rooms, Banquet Halls & Entrance | Hotel Devang",
    description: "Take a visual tour of Hotel Devang. Browse photos of our Deluxe AC family rooms, spacious banquet halls, and modern reception lobby in Dwarka.",
    url: "https://hoteldevang.com/gallery",
    type: "website",
    siteName: "Hotel Devang",
    locale: "en_IN",
    images: [
      {
        url: "https://hoteldevang.com/Photos/index/Hero4.jpeg",
        secureUrl: "https://hoteldevang.com/Photos/index/Hero4.jpeg",
        width: 1200,
        height: 630,
        alt: "Hotel Devang Dwarka Visual Photo Gallery",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Gallery – Rooms, Banquet Halls & Entrance | Hotel Devang",
    description: "Take a visual tour of Hotel Devang. Browse photos of our Deluxe AC family rooms, spacious banquet halls, and modern reception lobby in Dwarka.",
    images: ["https://hoteldevang.com/Photos/index/Hero4.jpeg"],
  },
};

export default function Page() {
  return <GalleryClient />;
}
