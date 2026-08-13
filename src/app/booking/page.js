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
  }
};

export default function Page() {
  return <BookingClient />;
}
