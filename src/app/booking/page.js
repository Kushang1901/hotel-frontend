import BookingClient from "./BookingClient";

export const metadata = {
  title: "Book Rooms Online | Hotel Devang Dwarka Official Booking",
  description: "Book your stay at Hotel Devang Dwarka online. Secure deluxe AC & non-AC family rooms, suites, and event halls directly at best rates. 24/7 reception & instant confirmation.",
  keywords: "hotel booking dwarka, book rooms dwarka, hotel devang booking, online room booking dwarka, cheap hotels dwarka",
  alternates: {
    canonical: "https://hoteldevang.com/booking",
  },
  openGraph: {
    title: "Book Rooms Online | Hotel Devang Dwarka Official Booking",
    description: "Book your stay at Hotel Devang Dwarka online. Secure deluxe AC & non-AC family rooms, suites, and event halls directly at best rates.",
    url: "https://hoteldevang.com/booking",
    type: "website",
    siteName: "Hotel Devang",
    locale: "en_IN",
    images: [
      {
        url: "https://hoteldevang.com/Photos/index/Hero4.jpeg",
        secureUrl: "https://hoteldevang.com/Photos/index/Hero4.jpeg",
        width: 1200,
        height: 630,
        alt: "Book Rooms Online at Hotel Devang Dwarka",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Rooms Online | Hotel Devang Dwarka Official Booking",
    description: "Book your stay at Hotel Devang Dwarka online. Secure deluxe AC & non-AC family rooms, suites, and event halls directly at best rates.",
    images: ["https://hoteldevang.com/Photos/index/Hero4.jpeg"],
  },
};

export default function Page() {
  return <BookingClient />;
}
