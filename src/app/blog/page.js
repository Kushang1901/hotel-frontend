import React from "react";
import Link from "next/link";
import "../css/blog.css";
import { blogData } from "../../data/blogData";
import { generateBlogPostingSchema, generateBreadcrumbSchema } from "../../lib/schemaMarkup";

export const metadata = {
  title: "Dwarka Travel Blog & Spiritual Stay Guide | Hotel Devang",
  description: "Read stories, pilgrim guides, local attractions, and travel tips for your visit to the holy city of Dwarka from the official blog of Hotel Devang.",
  keywords: "dwarka travel blog, spiritual guide dwarka, places to visit dwarka, travel tips dwarka, hotel devang blog",
  alternates: {
    canonical: "https://hoteldevang.com/blog",
  },
  openGraph: {
    title: "Dwarka Travel Blog & Spiritual Stay Guide | Hotel Devang",
    description: "Read stories, pilgrim guides, local attractions, and travel tips for your visit to the holy city of Dwarka.",
    url: "https://hoteldevang.com/blog",
    type: "website",
  }
};

export default function Blog() {
  const currentPost = blogData[0];
  const blogSchema = generateBlogPostingSchema(currentPost, currentPost.slug);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", slug: "" },
    { name: "Blog", slug: "blog" },
    { name: currentPost.title, slug: `blog#${currentPost.slug}` }
  ]);

  return (
    <div className="page-blog">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="blog-hero">
        <div className="hero-content">
          <h1>Hotel Devang Blog</h1>
          <p>Stories, Travel Guides & Spiritual Experiences from Dwarka</p>
        </div>
      </section>

      <section className="blog-article-section">
        <div className="blog-hero-image">
          <img src="/Photos/index/blog.png" alt="Hotel Devang" />
        </div>

        <div className="blog-content">
          <h1>Hotel Devang – Your Family-Friendly Stay in Dwarka</h1>

          <p>
            Hotel Devang brings you a warm and comfortable family-friendly stay in the holy city of Dwarka. Located just minutes away from Dwarkadhish Temple, the hotel offers a perfect blend of traditional hospitality and modern luxury.
          </p>

          <h2>A Comfortable Home for Families</h2>
          <p>
            With 43 spacious and well-designed rooms, Hotel Devang is ideal for both small and large families. Every room is crafted for peaceful sleep, comfort, and cleanliness.
          </p>

          <h2>Close to All Holy Sites</h2>
          <p>
            Our location offers convenience for devotees who want quick access to the Dwarkadhish Temple, Gomti Ghat, and other sacred attractions.
          </p>

          <h2>Why Guests Prefer Hotel Devang</h2>
          <ul>
            <li> Spacious rooms perfect for families</li>
            <li> Peaceful environment & safe stay</li>
            <li> Very close to Dwarkadhish Temple</li>
            <li> Warm and caring staff</li>
            <li> Comfortable beds & clean rooms</li>
            <li> Affordable yet premium experience</li>
          </ul>

          <p>
            At Hotel Devang, we believe in creating a meaningful journey—not just a stay. With warm hospitality and the essence of Gujarat’s culture, your visit to Dwarka becomes unforgettable.
          </p>

          <div className="back-home-container">
            <Link href="/" className="back-home-btn">← Back to Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
