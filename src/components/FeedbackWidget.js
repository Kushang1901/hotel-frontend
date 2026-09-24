"use client";

import React, { useState, useEffect } from "react";

const REVIEW_LINK = "https://g.page/r/CeWKBbju6FOREAE/review";

const EXPERIENCE_TAGS = [
  "Spacious & Clean Rooms",
  "Near Dwarkadhish Temple",
  "Courteous & Helpful Staff",
  "Comfortable Beds",
  "Pure Veg Breakfast",
  "Fast Room Service",
  "Ample Free Parking",
  "Peaceful Ambience"
];

const RATING_DESCRIPTIONS = {
  1: "Needs Attention • Subpar experience",
  2: "Fair • Room for improvement",
  3: "Good • Satisfying stay",
  4: "Very Good • Wonderful experience",
  5: "Excellent • Outstanding hospitality!"
};

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comments, setComments] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openModal = () => {
    setIsSubmitted(false);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare compiled feedback
    const feedbackParts = [];
    if (comments.trim()) {
      feedbackParts.push(comments.trim());
    }
    if (selectedTags.length > 0) {
      feedbackParts.push(`Highlights: ${selectedTags.join(", ")}`);
    }

    const compiledText = feedbackParts.join("\n\n");

    // Copy to clipboard if text is present
    if (compiledText && typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(compiledText);
      } catch (err) {
        console.warn("Clipboard access denied or unavailable", err);
      }
    }

    // Persist locally for management records
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = JSON.parse(localStorage.getItem("hotel_devang_feedbacks") || "[]");
        stored.push({
          rating,
          tags: selectedTags,
          comments: comments.trim(),
          guestName: guestName.trim() || "Guest",
          date: new Date().toISOString()
        });
        localStorage.setItem("hotel_devang_feedbacks", JSON.stringify(stored));
      }
    } catch (err) {
      console.warn("Could not save to localStorage", err);
    }

    // Open Hotel Devang direct review destination in new tab
    if (typeof window !== "undefined") {
      window.open(REVIEW_LINK, "_blank", "noopener,noreferrer");
    }

    // Show luxury thank-you success screen
    setIsSubmitted(true);
  };

  const currentDisplayRating = hoverRating || rating;

  return (
    <>
      {/* ── Fixed Right-Side Floating Tab ── */}
      <button
        id="feedback-trigger-btn"
        className="feedback-tab-btn"
        onClick={openModal}
        aria-label="Share Feedback"
        title="Share your feedback"
      >
        <span className="feedback-tab-text">Share Feedback</span>
        <span className="feedback-tab-icon">
          <i className="fa-solid fa-bars-staggered"></i>
        </span>
      </button>

      {/* ── Feedback Modal Dialog ── */}
      <div
        className={`feedback-overlay ${isOpen ? "active" : ""}`}
        onClick={closeModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
      >
        <div
          className="feedback-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="feedback-modal-header">
            <button
              className="feedback-close-btn"
              onClick={closeModal}
              aria-label="Close dialog"
            >
              ✕
            </button>
            <div className="feedback-badge">
              <i className="fa-solid fa-feather-pointed"></i> Hotel Devang Dwarka
            </div>
            <h2 id="feedback-dialog-title" className="feedback-title">
              Share Your Experience
            </h2>
            <p className="feedback-subtitle">
              Your valuable feedback and ratings help us make every stay exceptional.
            </p>
          </div>

          {/* Body */}
          {isSubmitted ? (
            <div className="feedback-success-view">
              <div className="success-icon-wrap">
                <i className="fa-solid fa-check"></i>
              </div>
              <h3 className="success-title">Thank You!</h3>
              <p className="success-desc">
                We sincerely appreciate your time and review. We look forward to welcoming you back to Hotel Devang, Dwarka!
              </p>
              <button className="feedback-done-btn" onClick={closeModal}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-modal-body">
              {/* Star Rating */}
              <div className="feedback-rating-box">
                <span className="rating-prompt">How was your stay with us?</span>
                <div className="star-rating-row" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${
                        star <= (hoverRating || rating) ? "active" : ""
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setRating(star)}
                      aria-label={`${star} star rating`}
                    >
                      <i className="fa-solid fa-star"></i>
                    </button>
                  ))}
                </div>
                <div className="rating-label-pill">
                  {RATING_DESCRIPTIONS[currentDisplayRating]}
                </div>
              </div>

              {/* Highlight Chips */}
              <div className="feedback-tags-section">
                <label className="feedback-section-label">
                  What did you like most?
                </label>
                <div className="feedback-tag-cloud">
                  {EXPERIENCE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`feedback-chip ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {isSelected && <i className="fa-solid fa-check" style={{ marginRight: "5px", fontSize: "10px" }}></i>}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Comment */}
              <div className="feedback-field-group">
                <label htmlFor="feedback-comment" className="feedback-section-label">
                  Your Feedback / Suggestions
                </label>
                <textarea
                  id="feedback-comment"
                  className="feedback-textarea"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share details of your room, service, or stay experience..."
                />
              </div>

              {/* Optional Guest Name */}
              <div className="feedback-field-group">
                <label htmlFor="feedback-guest-name" className="feedback-section-label">
                  Your Name (Optional)
                </label>
                <input
                  id="feedback-guest-name"
                  type="text"
                  className="feedback-input"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-feedback-btn"
                className="feedback-submit-btn"
              >
                <span>Submit Feedback</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
