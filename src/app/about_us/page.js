import AboutUsClient from "./AboutUsClient";

export const metadata = {
  title: "About Hotel Devang – 27+ Years of Hospitality in Dwarka",
  description: "Established in 1997, Hotel Devang is a trusted family hotel near Dwarkadhish Temple in Dwarka. Managed by the Acharya brothers, offering 43 deluxe rooms and warm Gujarati hospitality.",
  keywords: "about hotel devang, hotels in dwarka, hotel devang founders, acharya brothers dwarka, legacy hotel dwarka",
  alternates: {
    canonical: "https://hoteldevang.com/about_us",
  },
  openGraph: {
    title: "About Hotel Devang – 27+ Years of Hospitality in Dwarka",
    description: "Established in 1997, Hotel Devang is a trusted family hotel near Dwarkadhish Temple in Dwarka. Managed by the Acharya brothers, offering 43 deluxe rooms.",
    url: "https://hoteldevang.com/about_us",
    type: "website",
  }
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How old is Hotel Devang?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hotel Devang has been serving guests since 1997. With more than 27 years of hospitality excellence, we proudly stand as one of the most trusted family hotels in Dwarka."
        }
      },
      {
        "@type": "Question",
        "name": "Is free Wi-Fi available at the hotel?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide complimentary high-speed Wi-Fi access to all our guests throughout the hotel premises."
        }
      },
      {
        "@type": "Question",
        "name": "How far is the hotel from Dwarkadhish Temple?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The hotel is approximately 800 meters to 1 kilometer from Dwarkadhish Temple. It takes around 10 minutes by foot."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AboutUsClient />
    </>
  );
}
