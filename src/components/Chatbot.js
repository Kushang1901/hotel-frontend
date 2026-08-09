"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🙏 Welcome to Hotel Devang! How can we help you?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(null);

  // Initialize session ID
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionIdRef.current) {
        sessionIdRef.current = window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      }
    }
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text) return;

    // Append user message
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    // Determine API Base
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port !== "";
    const apiBase = isLocal
      ? "http://localhost:3000"
      : "https://hotel-booking-1-gg1m.onrender.com";

    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          userMessage: text,
          messages: newMessages.slice(1) // exclude initial welcome message
        })
      });

      const data = await response.json();
      setIsTyping(false);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Assistant request failed");
      }

      if (data.sessionId) {
        sessionIdRef.current = data.sessionId;
      }

      const reply = data.reply || "I’m here to help with live hotel information.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I could not reach the live hotel assistant right now. Please try again in a moment."
        }
      ]);
    }
  };

  const formatMessageContent = (content) => {
    // Replicates reply.replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Very basic formatting for bold text (e.g. **bold**)
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const renderedLine = parts.map((part, i) => {
        if (i % 2 === 1) {
          return <strong key={i}>{part}</strong>;
        }
        return part;
      });
      return (
        <span key={idx}>
          {renderedLine}
          {idx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      <div className={`chat-container ${isOpen ? "show" : ""}`} id="chatBox">
        <div className="chat-header">
          <div className="contact-icons">
            <a href="tel:+919824402132">
              <i className="fas fa-phone-alt"></i>
            </a>
            <a href="mailto:info@hoteldevang.com">
              <i className="fas fa-envelope"></i>
            </a>
            <a href="https://wa.me/919824402132" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
          <button onClick={toggleChat}>✕</button>
        </div>

        <div className="chat-messages" id="chatMessages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
              {formatMessageContent(msg.content)}
            </div>
          ))}
          {isTyping && (
            <div className="bot-message typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something…"
            onKeyPress={handleKey}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>

      <button className="chat-toggle" onClick={toggleChat} aria-label="Toggle Chat">
        <i className="fas fa-comments"></i>
      </button>
    </>
  );
}
