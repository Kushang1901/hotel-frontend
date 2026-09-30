import RoomDetailClient from "./RoomDetailClient";
import { roomsData } from "../../../data/roomsData";
import { generateRoomSchema, generateBreadcrumbSchema } from "../../../lib/schemaMarkup";

// Pre-render these 7 routes at build time (required for output: 'export')
export async function generateStaticParams() {
  return Object.keys(roomsData).map((slug) => ({
    slug: slug,
  }));
}

// Generate dynamic SEO metadata for each room page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const room = roomsData[slug];

  if (!room) {
    return {
      title: "Room Not Found | Hotel Devang Dwarka",
      description: "The requested accommodation type could not be found.",
    };
  }

  const title = `${room.title} in Dwarka | Hotel Devang`;
  const description = `${room.description.substring(0, 150)}... Book ${room.title} near Dwarkadhish Temple. AC/Non-AC options, double beds, modern bathroom.`;
  const canonicalUrl = `https://hoteldevang.com/room/${slug}`;

  return {
    title,
    description,
    keywords: `${room.title.toLowerCase()} dwarka, hotel rooms dwarka, accommodation dwarka near temple, hotel devang ${room.type.toLowerCase()}`,
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
          url: room.image,
          alt: room.title,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const room = roomsData[slug];

  if (!room) {
    return (
      <div style={{ padding: "120px 20px", textAlign: "center", background: "#fdf8f1" }}>
        <h1 style={{ fontFamily: "serif", color: "#880000" }}>Room Not Found</h1>
        <p>The requested room category does not exist.</p>
      </div>
    );
  }

  const roomSchema = generateRoomSchema(room, slug);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", slug: "" },
    { name: "Rooms", slug: "room" },
    { name: room.title, slug: `room/${slug}` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roomSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <RoomDetailClient room={room} />
    </>
  );
}
