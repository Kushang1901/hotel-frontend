import FacilitiesClient from "./FacilitiesClient";

export const metadata = {
  title: "Amenities & AC Event Halls in Dwarka | Hotel Devang",
  description: "Explore premium amenities at Hotel Devang. Offering spacious AC & non-AC marriage/event halls, free parking, high-speed Wi-Fi, 24/7 room service, and travel desk in Dwarka.",
  keywords: "hotel facilities dwarka, ac banquet hall dwarka, marriage halls in dwarka, hotel devang amenities, party halls dwarka",
  alternates: {
    canonical: "https://hoteldevang.com/facilities",
  },
  openGraph: {
    title: "Amenities & AC Event Halls in Dwarka | Hotel Devang",
    description: "Explore premium amenities at Hotel Devang. Offering spacious AC & non-AC marriage/event halls, free parking, high-speed Wi-Fi, and room service.",
    url: "https://hoteldevang.com/facilities",
    type: "website",
  }
};

export default function Page() {
  return <FacilitiesClient />;
}
