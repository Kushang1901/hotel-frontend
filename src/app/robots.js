export const dynamic = "force-static";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      {
        userAgent: "msnbot",
        allow: "/",
      },
    ],
    sitemap: "https://hoteldevang.com/sitemap.xml",
  };
}
