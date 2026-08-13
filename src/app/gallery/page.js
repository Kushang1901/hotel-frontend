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
  }
};

export default function Page() {
  return <GalleryClient />;
}
