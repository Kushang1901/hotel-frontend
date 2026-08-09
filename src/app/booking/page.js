"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "../css/booking.css";

const GOOGLE_HOLIDAY_CALENDAR_ID = "en.indian#holiday@group.v.calendar.google.com";
const GOOGLE_HOLIDAY_API_KEY = "AIzaSyCgh1m5nFDscvyQ3Fyn9QxuGWWh0WtbDtk";

const TOTAL_CAPACITIES = {
  "Standard": 2,
  "Deluxe": 31,
  "Super Deluxe": 8,
  "Suite": 2
};

export default function Booking() {
  const [apiBase, setApiBase] = useState("");
  const [phase, setPhase] = useState(1);
  const [alertMsg, setAlertMsg] = useState("");

  // Dates
  const [checkInVal, setCheckInVal] = useState("");
  const [checkOutVal, setCheckOutVal] = useState("");
  const [guestDob, setGuestDob] = useState("");

  // Calendar
  const [publicCurrentMonth, setPublicCurrentMonth] = useState(new Date());
  const [publicBookings, setPublicBookings] = useState([]);
  const [publicBlocks, setPublicBlocks] = useState([]);
  const [publicCalendarLoaded, setPublicCalendarLoaded] = useState(false);
  const [holidays, setHolidays] = useState({});

  // Room selections
  const [roomTypesList, setRoomTypesList] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Guest particulars
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNoVacancyModal, setShowNoVacancyModal] = useState(false);

  // Completed Booking Details
  const [lastBooking, setLastBooking] = useState(null);

  // Turnstile
  const [turnstileToken, setTurnstileToken] = useState("");

  // Loading references
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // 1. Setup API Base
  useEffect(() => {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port !== "";
    setApiBase(isLocal ? "http://localhost:3000" : "https://devang-inventory.vercel.app");
  }, []);

  // 2. Fetch calendar availability
  useEffect(() => {
    if (!apiBase) return;
    async function fetchCalendar() {
      try {
        let res;
        let data;
        try {
          res = await fetch(`${apiBase}/api/public/calendar-availability`);
          data = await res.json();
        } catch (err) {
          if (apiBase.includes("localhost") || apiBase.includes("127.0.0.1")) {
            console.warn("Local inventory API unavailable, falling back to production...");
            setApiBase("https://devang-inventory.vercel.app");
            return;
          }
          throw err;
        }

        if (data && data.success) {
          setPublicBookings(data.bookings || []);
          setPublicBlocks(data.blocks || []);
          setPublicCalendarLoaded(true);
        }
      } catch (err) {
        console.warn("Calendar live data unavailable, showing default availability", err);
      }
    }
    fetchCalendar();
  }, [apiBase]);

  // 3. Fetch Google Holidays
  useEffect(() => {
    const year = publicCurrentMonth.getFullYear();
    if (holidays[year]) return;

    async function fetchHolidays() {
      try {
        const timeMin = new Date(Date.UTC(year, 0, 1)).toISOString();
        const timeMax = new Date(Date.UTC(year + 1, 0, 1)).toISOString();
        const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_HOLIDAY_CALENDAR_ID)}/events`);
        url.searchParams.set("key", GOOGLE_HOLIDAY_API_KEY);
        url.searchParams.set("timeMin", timeMin);
        url.searchParams.set("timeMax", timeMax);
        url.searchParams.set("singleEvents", "true");
        url.searchParams.set("orderBy", "startTime");
        url.searchParams.set("maxResults", "2500");

        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          const formatted = {};
          for (let i = 0; i < 12; i++) formatted[i] = [];

          (data.items || []).forEach((event) => {
            const startDate = event.start?.date || event.start?.dateTime;
            if (!startDate) return;

            const d = new Date(startDate);
            if (isNaN(d.getTime())) return;

            const monthIndex = d.getUTCMonth();
            const dateNum = d.getUTCDate();
            const name = (event.summary || "").trim();
            if (!name) return;

            const haystack = `${name} ${event.description || ""}`.toLowerCase();
            const type = /gazetted|public holiday|national holiday|republic day|independence day|good friday|muharram|holi|christmas day|mahatma gandhi jayanti|ambedkar jayanti|maha shivratri|ram navami|mahavir jayanti|guru nanak jayanti|diwali|deepavali/.test(haystack)
              ? "Gazetted"
              : "Festival";

            if (!formatted[monthIndex].some((item) => item.date === dateNum && item.name === name)) {
              formatted[monthIndex].push({ date: dateNum, name, type });
            }
          });

          for (const m in formatted) {
            formatted[m].sort((a, b) => a.date - b.date || a.name.localeCompare(b.name));
          }

          setHolidays((prev) => ({ ...prev, [year]: formatted }));
        }
      } catch (err) {
        console.warn("Google Calendar holidays unavailable", err);
      }
    }
    fetchHolidays();
  }, [publicCurrentMonth, holidays]);

  // Load Cloudflare Turnstile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      window.onTurnstileSuccess = (token) => {
        setTurnstileToken(token);
      };

      return () => {
        document.body.removeChild(script);
        delete window.onTurnstileSuccess;
      };
    }
  }, []);

  // Helper date parsing/normalization functions
  const normalizeDbDate = (d) => {
    if (!d) return 0;
    const dateStr = typeof d === "string" ? d : new Date(d).toISOString();
    const parts = dateStr.split("T")[0].split("-");
    return Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  };

  const getLocalDateString = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getPublicDayStats = (date) => {
    const targetTime = date.getTime();

    const dailyBookings = publicBookings.filter((b) => {
      if (b.bookingStatus === "Cancelled") return false;
      const checkInTime = normalizeDbDate(b.checkIn);
      const checkOutTime = normalizeDbDate(b.checkOut);
      return targetTime >= checkInTime && targetTime < checkOutTime;
    });

    const dailyBlocks = publicBlocks.filter((block) => {
      const startTime = normalizeDbDate(block.startDate);
      const endTime = normalizeDbDate(block.endDate);
      return targetTime >= startTime && targetTime <= endTime;
    });

    const isHotelFullyBlocked = dailyBlocks.some((block) => block.roomType === "All");
    const blockedTypes = new Set(
      dailyBlocks
        .filter((block) => block.roomType !== "All")
        .map((block) => block.roomType)
    );

    const bookedCounts = { "Standard": 0, "Deluxe": 0, "Super Deluxe": 0, "Suite": 0 };

    dailyBookings.forEach((b) => {
      if (b.rooms && b.rooms.length > 0) {
        b.rooms.forEach((room) => {
          const type = room.roomType;
          if (bookedCounts[type] !== undefined) {
            bookedCounts[type] += Number(room.quantity) || 1;
          }
        });
      } else if (b.roomType) {
        const type = b.roomType;
        if (bookedCounts[type] !== undefined) {
          bookedCounts[type] += 1;
        }
      }
    });

    const roomStats = Object.keys(TOTAL_CAPACITIES).map((type) => {
      const cap = TOTAL_CAPACITIES[type];
      const booked = bookedCounts[type] || 0;
      const isBlocked = isHotelFullyBlocked || blockedTypes.has(type);
      const available = isBlocked ? 0 : Math.max(0, cap - booked);

      return { type, cap, booked, available, isBlocked };
    });

    const totalRooms = Object.values(TOTAL_CAPACITIES).reduce((sum, c) => sum + c, 0);
    const totalBooked = Object.values(bookedCounts).reduce((sum, b) => sum + b, 0);
    const totalBlockedCount = roomStats.filter((r) => r.isBlocked).length;

    let dayStatus = "Available";
    if (isHotelFullyBlocked) {
      dayStatus = "Blocked";
    } else if (totalBooked >= totalRooms) {
      dayStatus = "Sold Out";
    } else if (totalBooked > 0 || totalBlockedCount > 0) {
      dayStatus = "Partially Booked";
    }

    return { rooms: roomStats, status: dayStatus, totalBooked, totalRooms };
  };

  // Calendar render details
  const renderCalendarDays = () => {
    const year = publicCurrentMonth.getFullYear();
    const month = publicCurrentMonth.getMonth();

    const firstDayIndex = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const numberOfDays = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const prevMonthNumberOfDays = new Date(Date.UTC(year, month, 0)).getUTCDate();

    const daysGrid = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      daysGrid.push({
        date: new Date(Date.UTC(year, month - 1, prevMonthNumberOfDays - i)),
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= numberOfDays; i++) {
      daysGrid.push({
        date: new Date(Date.UTC(year, month, i)),
        isCurrentMonth: true
      });
    }

    // Next month padding to 42 grids
    const remainingSlots = 42 - daysGrid.length;
    for (let i = 1; i <= remainingSlots; i++) {
      daysGrid.push({
        date: new Date(Date.UTC(year, month + 1, i)),
        isCurrentMonth: false
      });
    }

    const todayUtc = new Date();
    todayUtc.setUTCHours(0, 0, 0, 0);

    const threeMonthsLimit = new Date();
    threeMonthsLimit.setUTCMonth(threeMonthsLimit.getUTCMonth() + 3);
    threeMonthsLimit.setUTCHours(23, 59, 59, 999);

    return daysGrid.map((item, idx) => {
      const isPast = item.date.getTime() < todayUtc.getTime();
      const isBeyondLimit = item.date.getTime() > threeMonthsLimit.getTime();
      const isToday =
        item.date.getUTCFullYear() === todayUtc.getFullYear() &&
        item.date.getUTCMonth() === todayUtc.getMonth() &&
        item.date.getUTCDate() === todayUtc.getDate();

      if (!item.isCurrentMonth) {
        return (
          <div key={idx} className="pub-cal-day-cell inactive">
            <span className="pub-cal-day-number">{item.date.getUTCDate()}</span>
          </div>
        );
      }

      if (isPast || isBeyondLimit) {
        return (
          <div
            key={idx}
            className="pub-cal-day-cell inactive"
            style={{ opacity: 0.15, cursor: "not-allowed", background: "rgba(0,0,0,0.4)" }}
            title={isPast ? "Past Date" : "Bookings are allowed for the next 3 months only"}
          >
            <span className="pub-cal-day-number">{item.date.getUTCDate()}</span>
          </div>
        );
      }

      const stats = getPublicDayStats(item.date);
      let cellClass = "green-cell";
      let indicatorClass = "pub-cal-indicator-green";
      let tooltip = "Available Rooms:\n";
      const availableTypes = [];

      stats.rooms.forEach((r) => {
        if (r.available > 0) {
          availableTypes.push(`${r.type}: ${r.available} Available`);
        }
      });

      if (stats.status === "Blocked") {
        cellClass = "red-cell";
        indicatorClass = "pub-cal-indicator-red";
        tooltip = "Fully Blocked (Maintenance / Outage)";
      } else if (stats.status === "Sold Out") {
        cellClass = "red-cell";
        indicatorClass = "pub-cal-indicator-red";
        tooltip = "Sold Out (No vacancy today)";
      } else if (stats.status === "Partially Booked") {
        cellClass = "amber-cell";
        indicatorClass = "pub-cal-indicator-amber";
        tooltip += availableTypes.join("\n") || "No rooms available";
      } else {
        tooltip += availableTypes.join("\n");
      }

      // Selection classes
      let isSelected = false;
      let isInRange = false;
      const cellTime = item.date.getTime();

      if (checkInVal) {
        const checkInTime = new Date(checkInVal).getTime();
        const checkOutTime = checkOutVal ? new Date(checkOutVal).getTime() : null;

        if (cellTime === checkInTime || cellTime === checkOutTime) {
          isSelected = true;
        } else if (checkOutTime && cellTime > checkInTime && cellTime < checkOutTime) {
          isInRange = true;
        }
      }

      const borderStyle = isToday ? { border: "1px solid var(--gold-border)", background: "rgba(202,160,53,0.06)" } : {};

      const handleCellClick = () => {
        const dateStr = getLocalDateString(item.date);
        if (!checkInVal || (checkInVal && checkOutVal)) {
          setCheckInVal(dateStr);
          setCheckOutVal("");
        } else {
          const checkInTime = new Date(checkInVal).getTime();
          const clickedTime = item.date.getTime();
          if (clickedTime > checkInTime) {
            setCheckOutVal(dateStr);
          } else {
            setCheckInVal(dateStr);
            setCheckOutVal("");
          }
        }
      };

      return (
        <div
          key={idx}
          className={`pub-cal-day-cell ${cellClass} ${isSelected ? "selected" : ""}`}
          style={{
            ...borderStyle,
            background: isInRange ? "rgba(202,160,53,0.16)" : undefined
          }}
          title={tooltip}
          onClick={handleCellClick}
        >
          <span className="pub-cal-day-number">{item.date.getUTCDate()}</span>
          <span className={`pub-cal-day-indicator ${indicatorClass}`}></span>
        </div>
      );
    });
  };

  const handleMonthNav = (dir) => {
    const nextMonth = new Date(publicCurrentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + dir);

    const today = new Date();
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);

    const targetMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    if (targetMonth >= minMonth && targetMonth <= maxMonth) {
      setPublicCurrentMonth(nextMonth);
    }
  };

  // Availability checking
  const handleCheckAvailability = async () => {
    setAlertMsg("");

    if (!checkInVal || !checkOutVal) {
      setAlertMsg("Please select both check-in and check-out dates on the calendar or input fields.");
      return;
    }

    if (!turnstileToken) {
      setAlertMsg("Please complete the verification challenge.");
      return;
    }

    setIsCheckingAvailability(true);

    try {
      const response = await fetch(
        `${apiBase}/api/public/check-availability?checkIn=${checkInVal}&checkOut=${checkOutVal}&recaptchaToken=${turnstileToken}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to query rooms availability");
      }

      setRoomTypesList(data.rooms);

      const availableTypes = data.rooms.filter((r) => r.availableCount > 0);
      if (availableTypes.length === 0) {
        setShowNoVacancyModal(true);
        if (typeof window !== "undefined" && window.turnstile) {
          window.turnstile.reset();
          setTurnstileToken("");
        }
        return;
      }

      // Setup default room field
      const defaultRoom = availableTypes[0];
      setSelectedRooms([
        {
          id: `room-row-${Date.now()}`,
          roomType: defaultRoom.id,
          selectedSubtype: defaultRoom.subtypes[0].code,
          quantity: 1,
          guests: 2
        }
      ]);

      setPhase(2);
    } catch (err) {
      console.error("Availability check failed:", err);
      setAlertMsg(err.message || "Failed to check room availability. Please try again.");
      if (typeof window !== "undefined" && window.turnstile) {
        window.turnstile.reset();
        setTurnstileToken("");
      }
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Fare calculations
  const getNights = () => {
    if (!checkInVal || !checkOutVal) return 1;
    const start = new Date(checkInVal);
    const end = new Date(checkOutVal);
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const getFareEstimation = () => {
    let subtotal = 0;
    const nights = getNights();
    const items = [];

    selectedRooms.forEach((room) => {
      const roomInfo = roomTypesList.find((r) => r.id === room.roomType);
      if (!roomInfo) return;

      const subtypeInfo = roomInfo.subtypes.find((s) => s.code === room.selectedSubtype);
      if (!subtypeInfo) return;

      const baseRate = subtypeInfo.price;
      const mattressCount = room.guests > 2 && room.roomType !== "Standard" ? room.guests - 2 : 0;
      const mattressCharge = mattressCount * 350;
      const pricePerNight = baseRate + mattressCharge;
      const rowTotal = pricePerNight * room.quantity * nights;

      subtotal += rowTotal;
      items.push({
        name: roomInfo.name,
        subtype: room.selectedSubtype,
        quantity: room.quantity,
        guests: room.guests,
        mattressCount,
        rowTotal
      });
    });

    const gst = Math.ceil(subtotal * 0.05);
    const total = subtotal + gst;
    const advance = Math.round(total * 0.5);
    const due = total - advance;

    return { subtotal, gst, total, advance, due, items };
  };

  const { subtotal, gst, total, advance, due, items: estimatedItems } = getFareEstimation();

  const handleAddRoomField = () => {
    const availableTypes = roomTypesList.filter((r) => r.availableCount > 0);
    if (availableTypes.length === 0) {
      setAlertMsg("No rooms are available for the selected dates.");
      return;
    }
    const defaultRoom = availableTypes[0];
    setSelectedRooms((prev) => [
      ...prev,
      {
        id: `room-row-${Date.now()}`,
        roomType: defaultRoom.id,
        selectedSubtype: defaultRoom.subtypes[0].code,
        quantity: 1,
        guests: 2
      }
    ]);
  };

  const handleRemoveRoomField = (id) => {
    setSelectedRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRoomTypeChange = (id, typeId) => {
    const roomInfo = roomTypesList.find((r) => r.id === typeId);
    if (!roomInfo) return;

    setSelectedRooms((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              roomType: typeId,
              selectedSubtype: roomInfo.subtypes[0].code,
              quantity: 1,
              guests: 2
            }
          : r
      )
    );
  };

  const handleRoomPropertyChange = (id, field, value) => {
    setSelectedRooms((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, [field]: value };

        const roomInfo = roomTypesList.find((room) => room.id === r.roomType);
        if (roomInfo) {
          if (field === "quantity" && value > roomInfo.availableCount) {
            updated.quantity = roomInfo.availableCount;
          }
          if (field === "guests" && value > roomInfo.maxPersons) {
            updated.guests = roomInfo.maxPersons;
          }
        }
        return updated;
      })
    );
  };

  // Payment integration
  const handleInitiatePayment = () => {
    setAlertMsg("");
    if (!guestName || !guestPhone || !guestDob) {
      setAlertMsg("Please fill in all guest particulars (Name, Phone, and DOB).");
      return;
    }
    if (selectedRooms.length === 0) {
      setAlertMsg("Please select at least one room to book.");
      return;
    }
    setShowConfirmModal(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to load Razorpay payment gateway"));
      document.head.appendChild(script);
    });
  };

  const executeRazorpayGateway = async () => {
    setShowConfirmModal(false);
    setAlertMsg("");
    setIsProcessingOrder(true);

    try {
      await loadRazorpay();

      // Format activeRooms for backend
      const formattedRooms = selectedRooms.map((room) => {
        const roomInfo = roomTypesList.find((r) => r.id === room.roomType);
        const subtypeInfo = roomInfo.subtypes.find((s) => s.code === room.selectedSubtype);
        const baseRate = subtypeInfo.price;
        const mattressCount = room.guests > 2 && room.roomType !== "Standard" ? room.guests - 2 : 0;
        const mattressCharge = mattressCount * 350;
        const pricePerNight = baseRate + mattressCharge;

        return {
          roomType: roomInfo.name, // e.g. Standard, Deluxe
          selectedSubtype: room.selectedSubtype,
          quantity: room.quantity,
          guests: room.guests,
          pricePerNight,
          baseRate,
          mattressCharge
        };
      });

      const response = await fetch(`${apiBase}/api/public/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkIn: checkInVal,
          checkOut: checkOutVal,
          rooms: formattedRooms
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create payment order");
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Hotel Devang",
        description: "50% Advance stay booking deposit",
        order_id: data.orderId,
        handler: function (rzpResponse) {
          verifyPayment(rzpResponse, data.orderId, formattedRooms);
        },
        prefill: {
          name: guestName,
          contact: guestPhone
        },
        theme: {
          color: "#880000"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation error:", err);
      setAlertMsg(err.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const verifyPayment = async (rzpResponse, orderId, formattedRooms) => {
    setIsProcessingOrder(true);
    try {
      const response = await fetch(`${apiBase}/api/public/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: rzpResponse.razorpay_payment_id,
          razorpay_order_id: rzpResponse.razorpay_order_id,
          razorpay_signature: rzpResponse.razorpay_signature,
          guestName,
          phone: guestPhone,
          dob: guestDob,
          checkIn: checkInVal,
          checkOut: checkOutVal,
          rooms: formattedRooms,
          specialRequests
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Payment verification failed");
      }

      setLastBooking(data.booking);
      setPhase(3);

      // Clear dates
      setCheckInVal("");
      setCheckOutVal("");
    } catch (err) {
      console.error("Verification error:", err);
      setAlertMsg(err.message || "Failed to confirm your booking. Please contact management.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // PDF download trigger
  const handleDownloadPDF = () => {
    if (!lastBooking) return;
    const element = document.getElementById("receiptFrame");
    if (element) {
      const loadHtml2pdf = () => {
        return new Promise((resolve) => {
          if (window.html2pdf) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
          script.onload = resolve;
          document.head.appendChild(script);
        });
      };

      loadHtml2pdf().then(() => {
        const opt = {
          margin: [0.4, 0.4, 0.4, 0.4],
          filename: `Hotel_Devang_Receipt_${lastBooking.bookingId}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2.5, useCORS: true, scrollY: 0, scrollX: 0 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };
        window.html2pdf().from(element).set(opt).save();
      });
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!lastBooking) return;
    const checkInDateStr = new Date(lastBooking.checkIn).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    });
    const checkOutDateStr = new Date(lastBooking.checkOut).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    });

    let cleanPhone = guestPhone.replace(/\D/g, "");
    if (cleanPhone.length === 10) {
      cleanPhone = "91" + cleanPhone;
    }

    const msg = `*HOTEL DEVANG DWARKA*
*Provisional Booking Confirmation*

Dear *${lastBooking.guestName}*, your stay reservation has been confirmed!

• *Booking ID:* ${lastBooking.bookingId}
• *Stay Period:* ${checkInDateStr} to ${checkOutDateStr}

We have automatically generated and downloaded your official *Provisional Bill PDF* to your device. Please select it from your *Downloads* and attach it in this chat for your records.

We look forward to welcoming you to Dwarka!`;

    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, "_blank");
  };

  const currentMonthName = publicCurrentMonth.toLocaleString("default", { month: "long" });
  const currentMonthHolidays = holidays[publicCurrentMonth.getFullYear()]?.[publicCurrentMonth.getMonth()] || [];

  return (
    <div className="page-booking">
      {/* HERO BANNER */}
      <section className="booking-hero">
        <span className="hero-badge">
          <i className="fa-solid fa-om"></i>
          Hotel Devang &nbsp;·&nbsp; Dwarka
        </span>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.4rem,5.5vw,3.8rem)", fontWeight: 700, color: "#fff", marginBottom: "0.8rem", letterSpacing: "-0.5px", position: "relative", zIndex: 1 }}>
          Reserve Your Royal Stay
        </h1>
        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", fontWeight: 300, maxWidth: "480px", margin: "0 auto 0", lineHeight: 1.65, fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.15rem", position: "relative", zIndex: 1 }}>
          Experience divine hospitality in the sacred city of Dwarka
        </p>
        <div className="hero-banner-ornament" style={{ position: "relative", zIndex: 1 }}>
          <div className="hero-ornament-diamond"></div>
        </div>
      </section>

      {/* MAIN WIZARD AREA */}
      <main>
        <div className="maint-card" id="bookingCard" style={{ maxWidth: "860px", transform: "translateY(-40px)", margin: "0 auto" }}>
          <div id="bookingWizard" className="wizard-panel">
            {/* Steps Progress Indicator */}
            <div className="step-tracker no-print">
              <div id="stepIndicator1" className={`step-node ${phase === 1 ? "active" : ""}`}>
                <span className="step-node-number">1</span>
                Dates
              </div>
              <div className="step-line"></div>
              <div id="stepIndicator2" className={`step-node ${phase === 2 ? "active" : ""}`}>
                <span className="step-node-number">2</span>
                Details
              </div>
              <div className="step-line"></div>
              <div id="stepIndicator3" className={`step-node ${phase === 3 ? "active" : ""}`}>
                <span className="step-node-number">3</span>
                Confirm
              </div>
            </div>

            {/* Error alerts */}
            {alertMsg && (
              <div
                style={{
                  display: "flex",
                  background: "rgba(136, 0, 0, 0.15)",
                  border: "1px solid rgba(136, 0, 0, 0.4)",
                  borderRadius: "10px",
                  padding: "1rem",
                  color: "#ffbaba",
                  fontSize: "0.85rem",
                  marginBottom: "1.5rem",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "1.1rem", color: "#ff4d4d" }}></i>
                <span>{alertMsg}</span>
              </div>
            )}

            {/* PHASE 1: DATE SELECTION */}
            {phase === 1 && (
              <div id="phase1">
                <h3 className="phase-heading">Plan Your Sacred Journey</h3>
                <p className="phase-sub">Check live room vacancies on the calendar below and select your stay dates.</p>

                <div className="phase1-layout-grid">
                  {/* Calendar Card */}
                  <div id="public-calendar-card" className="public-calendar-card">
                    <div className="pub-cal-month-header">
                      <h4 id="pubCalMonthTitle" className="pub-cal-month-title">
                        {currentMonthName} <span>{publicCurrentMonth.getFullYear()}</span>
                      </h4>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button type="button" onClick={() => handleMonthNav(-1)} className="pub-cal-nav-btn">
                          <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <button type="button" onClick={() => setPublicCurrentMonth(new Date())} className="pub-cal-nav-btn" style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" }}>
                          Today
                        </button>
                        <button type="button" onClick={() => handleMonthNav(1)} className="pub-cal-nav-btn">
                          <i className="fa-solid fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>

                    <div className="pub-cal-weekdays">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>

                    <div id="pubCalDaysGrid" className="pub-cal-days-grid">
                      {renderCalendarDays()}
                    </div>

                    <div className="pub-cal-legend">
                      <div className="pub-cal-legend-item">
                        <span className="pub-cal-day-indicator pub-cal-indicator-green" style={{ display: "inline-block", alignSelf: "center" }}></span>
                        <span>Available</span>
                      </div>
                      <div className="pub-cal-legend-item">
                        <span className="pub-cal-day-indicator pub-cal-indicator-amber" style={{ display: "inline-block", alignSelf: "center" }}></span>
                        <span>Partially Booked</span>
                      </div>
                      <div className="pub-cal-legend-item">
                        <span className="pub-cal-day-indicator pub-cal-indicator-red" style={{ display: "inline-block", alignSelf: "center" }}></span>
                        <span>Fully Blocked / Sold Out</span>
                      </div>
                    </div>
                  </div>

                  {/* Input form panel */}
                  <div className="date-inputs-panel">
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                      <div className="field-group">
                        <label>Check-in Date</label>
                        <input
                          type="date"
                          value={checkInVal}
                          onChange={(e) => setCheckInVal(e.target.value)}
                          className="input-control"
                          min={getLocalDateString(new Date())}
                        />
                      </div>
                      <div className="field-group">
                        <label>Check-out Date</label>
                        <input
                          type="date"
                          value={checkOutVal}
                          onChange={(e) => setCheckOutVal(e.target.value)}
                          className="input-control"
                          min={checkInVal ? getLocalDateString(new Date(new Date(checkInVal).getTime() + 86400000)) : getLocalDateString(new Date())}
                        />
                      </div>
                    </div>

                    <div className="recaptcha-row" style={{ marginTop: "1rem" }}>
                      <div className="cf-turnstile" data-sitekey="0x4AAAAAAD4ZhZeB0hlkvbiu" data-theme="dark" data-callback="onTurnstileSuccess"></div>
                    </div>

                    <button id="btnCheckAvailability" onClick={handleCheckAvailability} className="btn btn-primary" disabled={isCheckingAvailability} style={{ marginTop: "1rem" }}>
                      {isCheckingAvailability ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i> Checking Availability...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-calendar-check"></i> Check Room Availability
                        </>
                      )}
                    </button>

                    {/* Holidays List */}
                    {currentMonthHolidays.length > 0 && (
                      <div id="indian-holidays-container" style={{ background: "rgba(202, 160, 53, 0.03)", border: "1px solid rgba(202, 160, 53, 0.22)", borderRadius: "12px", padding: "1rem", marginTop: "1.2rem", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)" }}>
                        <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.78rem", textTransform: "uppercase", color: "var(--gold)", letterSpacing: "0.08em", margin: "0 0 0.6rem 0", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                          <i className="fa-solid fa-calendar-day"></i> <span>Indian Holidays & Festivals ({currentMonthName})</span>
                        </h4>
                        <div id="indian-holidays-list" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                          {currentMonthHolidays.map((h, idx) => {
                            const typeColor = h.type === "Gazetted" ? "#ff4d4d" : h.type === "Festival" ? "#51cf66" : "#ffa94d";
                            return (
                              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "8px", padding: "0.5rem 0.8rem" }}>
                                <div style={{ display: "flex", height: "28px", width: "28px", minWidth: "28px", alignItems: "center", justifyCenter: "center", borderRadius: "6px", border: "1px solid rgba(202, 160, 53, 0.25)", background: "rgba(202, 160, 53, 0.08)", fontSize: "0.78rem", fontWeight: 700, color: "var(--gold-light)", fontFamily: "'Jost', sans-serif", justifyContent: "center" }}>
                                  {h.date}
                                </div>
                                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                                  <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 500, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{h.name}</p>
                                  <span style={{ display: "inline-block", fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: typeColor, marginTop: "1px" }}>{h.type}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 2: GUEST & ROOM SELECTION */}
            {phase === 2 && (
              <div id="phase2">
                <h3 className="phase-heading">Reservation & Room Setup</h3>
                <p className="phase-sub">Customize your rooms and specify guest details below.</p>

                {/* Guidelines */}
                <div className="guidelines-banner animate-fadeIn" style={{ background: "rgba(202, 160, 53, 0.05)", border: "1px solid rgba(202, 160, 53, 0.22)", borderRadius: "12px", padding: "1.2rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "0.8rem", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <i className="fa-solid fa-circle-info" style={{ color: "var(--gold)", fontSize: "1.15rem", marginTop: "2px" }}></i>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold-light)", fontWeight: 600, margin: "0 0 0.3rem 0" }}>Stay Guidelines & Checkout</h4>
                      <p style={{ fontSize: "0.8rem", color: "rgba(253, 248, 241, 0.8)", lineHeight: 1.5, margin: 0 }}>
                        <strong style={{ color: "#fff" }}>Checkout & Check-in Timings:</strong> Standard check-out is <strong style={{ color: "#fff" }}>10:00 AM</strong> (max extension up to <strong style={{ color: "var(--gold-light)" }}>10:30 AM</strong>). Standard check-in starts from <strong style={{ color: "var(--gold-light)" }}>12:30 PM</strong> due to room cleaning and housekeeping preparation.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", borderTop: "1px solid rgba(253, 248, 241, 0.08)", paddingTop: "0.8rem" }}>
                    <i className="fa-solid fa-id-card" style={{ color: "#ff4d4d", fontSize: "1.15rem", marginTop: "2px" }}></i>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffbaba", fontWeight: 600, margin: "0 0 0.3rem 0" }}>Mandatory Security Regulation</h4>
                      <p style={{ fontSize: "0.8rem", color: "rgba(253, 248, 241, 0.8)", lineHeight: 1.5, margin: 0 }}>
                        <strong style={{ color: "#ffbaba" }}>Government ID Required:</strong> For your safety and local regulations, a valid government-approved physical photo ID proof is <strong style={{ color: "#fff" }}>absolutely mandatory for all adult members</strong> staying in the hotel upon check-in.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", borderTop: "1px solid rgba(253, 248, 241, 0.08)", paddingTop: "0.8rem" }}>
                    <i className="fa-solid fa-circle-exclamation" style={{ color: "#ffa94d", fontSize: "1.15rem", marginTop: "2px" }}></i>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#ffe3b3", fontWeight: 600, margin: "0 0 0.3rem 0" }}>Important Refund Policy</h4>
                      <p style={{ fontSize: "0.8rem", color: "rgba(253, 248, 241, 0.8)", lineHeight: 1.5, margin: 0 }}>
                        <strong style={{ color: "#ffe3b3" }}>Non-Refundable Deposit:</strong> The 50% advance booking payment is <strong style={{ color: "#ffa94d", fontWeight: 600, textTransform: "uppercase", background: "rgba(255, 169, 77, 0.1)", padding: "1px 5px", borderRadius: "4px", border: "1px solid rgba(255, 169, 77, 0.2)" }}>strictly non-refundable</strong>. Please confirm your dates before initiating the transaction.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="phase2-grid">
                  {/* Guest form and rooms list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gold)", fontWeight: 700, borderBottom: "1px solid rgba(202,160,53,0.15)", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
                      Guest Particulars
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                      <div className="field-group">
                        <label>Full Name</label>
                        <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Enter primary guest name" className="input-control" />
                      </div>
                      <div className="field-group">
                        <label>Phone Number</label>
                        <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="Enter contact number" className="input-control" />
                      </div>
                      <div className="field-group">
                        <label>Date of Birth</label>
                        <input type="date" value={guestDob} onChange={(e) => setGuestDob(e.target.value)} className="input-control" max={getLocalDateString(new Date())} />
                      </div>
                      <div className="field-group">
                        <label style={{ color: "var(--gold)", fontWeight: 600 }}>
                          <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "5px" }}></i> Staying Period Details
                        </label>
                        <div className="stay-preview-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(202, 160, 53, 0.04)", border: "1px solid rgba(202, 160, 53, 0.25)", borderRadius: "8px", padding: "0.5rem 1.2rem", height: "42px", width: "100%" }}>
                          <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                            <span style={{ fontSize: "0.55rem", textTransform: "uppercase", color: "rgba(253, 248, 241, 0.4)", lineHeight: 1.1 }}>Check-In</span>
                            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff", fontFamily: "'Jost', sans-serif" }}>
                              {checkInVal ? new Date(checkInVal).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "--/--/----"}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7 }}>
                            <i className="fa-solid fa-arrow-right-long" style={{ color: "var(--gold)", fontSize: "0.85rem" }}></i>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
                            <span style={{ fontSize: "0.55rem", textTransform: "uppercase", color: "rgba(253, 248, 241, 0.4)", lineHeight: 1.1 }}>Check-Out</span>
                            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff", fontFamily: "'Jost', sans-serif" }}>
                              {checkOutVal ? new Date(checkOutVal).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "--/--/----"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="field-group">
                        <label>Special Requests (Optional)</label>
                        <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Write any requests (e.g. ground floor, extra mattress...)" className="input-control" style={{ height: "65px", resize: "none" }} />
                      </div>
                    </div>

                    {/* Room selections heading */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(202,160,53,0.15)", paddingBottom: "0.5rem", marginTop: "1rem" }}>
                      <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gold)", fontWeight: 700 }}>Select Rooms to Book</h4>
                      <button onClick={handleAddRoomField} className="btn" style={{ padding: "0.35rem 0.85rem", borderRadius: "50px", fontSize: "0.75rem", border: "1px solid var(--gold)", background: "transparent", color: "var(--gold-light)" }}>
                        <i className="fa-solid fa-plus"></i> Add Another Room
                      </button>
                    </div>

                    {/* Rooms lists */}
                    <div id="roomsContainer" style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                      {selectedRooms.map((room, idx) => {
                        const roomInfo = roomTypesList.find((r) => r.id === room.roomType);
                        const availableTypes = roomTypesList.filter((r) => r.availableCount > 0);

                        return (
                          <div
                            key={room.id}
                            className="room-selection-row"
                            style={{
                              background: "rgba(255, 255, 255, 0.01)",
                              border: "1px solid rgba(255, 255, 255, 0.05)",
                              borderRadius: "12px",
                              padding: "1.2rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.6rem",
                              position: "relative"
                            }}
                          >
                            <div className="room-row-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", width: "100%" }}>
                              <div className="field-group">
                                <label>Room Type</label>
                                <select value={room.roomType} onChange={(e) => handleRoomTypeChange(room.id, e.target.value)} className="input-control room-type-select">
                                  {availableTypes.map((r) => (
                                    <option key={r.id} value={r.id}>
                                      {r.name} (Max {r.maxPersons} guests, {r.availableCount} left)
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="field-group">
                                <label>Subtype & Price</label>
                                <select value={room.selectedSubtype} onChange={(e) => handleRoomPropertyChange(room.id, "selectedSubtype", e.target.value)} className="input-control room-subtype-select">
                                  {roomInfo?.subtypes.map((s) => (
                                    <option key={s.code} value={s.code}>
                                      {s.name} - ₹{s.price}/night
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="field-group">
                                <label>Quantity</label>
                                <input
                                  type="number"
                                  min="1"
                                  max={roomInfo?.availableCount}
                                  value={room.quantity}
                                  onChange={(e) => handleRoomPropertyChange(room.id, "quantity", parseInt(e.target.value) || 1)}
                                  className="input-control room-quantity-input"
                                />
                              </div>
                              <div className="field-group">
                                <label>Guests</label>
                                <input
                                  type="number"
                                  min="1"
                                  max={roomInfo?.maxPersons}
                                  value={room.guests}
                                  onChange={(e) => handleRoomPropertyChange(room.id, "guests", parseInt(e.target.value) || 1)}
                                  className="input-control room-guests-input"
                                />
                              </div>
                            </div>

                            <div className="room-mattress-info" style={{ fontSize: "0.72rem", marginTop: "0.2rem", lineHeight: 1.3 }}>
                              {room.guests > 2 && room.roomType !== "Standard" ? (
                                <span style={{ color: "var(--gold-light)", fontWeight: 600 }}>
                                  {room.guests - 2} Extra Guest{room.guests - 2 > 1 ? "s" : ""} × ₹350/night × {getNights()} nights ={" "}
                                  <span style={{ textDecoration: "underline" }}>₹{((room.guests - 2) * 350 * getNights()).toLocaleString("en-IN")}</span>
                                </span>
                              ) : room.roomType === "Standard" ? (
                                <span style={{ color: "rgba(253, 248, 241, 0.45)" }}>Extra mattress/guest not allowed for Standard rooms</span>
                              ) : (
                                <span style={{ color: "rgba(253, 248, 241, 0.6)" }}>₹350/night per extra guest (applicable for &gt; 2 guests)</span>
                              )}
                            </div>

                            {idx > 0 && (
                              <button
                                onClick={() => handleRemoveRoomField(room.id)}
                                style={{ position: "absolute", top: "0.6rem", right: "0.6rem", background: "transparent", border: "none", color: "#ff4d4d", fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%" }}
                                title="Remove Room"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fare breakdown estimation card */}
                  <div>
                    <div className="price-ledger-card">
                      <h4 className="price-ledger-title">Fare Estimation</h4>

                      <div id="summaryBreakdown" className="price-ledger-breakdown">
                        {estimatedItems.map((item, idx) => (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "rgba(253, 248, 241, 0.7)", marginBottom: "0.4rem" }}>
                            <span>
                              {item.quantity}x {item.name} ({item.subtype})
                              {item.mattressCount > 0 ? ` + ${item.mattressCount} Extra Mattress` : ""} x {getNights()} night{getNights() > 1 ? "s" : ""}
                            </span>
                            <span>₹{item.rowTotal.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>

                      <div className="price-ledger-totals">
                        <div className="price-ledger-row" style={{ color: "rgba(253, 248, 241, 0.7)", fontWeight: 500, fontSize: "0.82rem" }}>
                          <span>Room Tariff Subtotal:</span>
                          <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="price-ledger-row" style={{ color: "rgba(253, 248, 241, 0.7)", fontWeight: 500, fontSize: "0.82rem", borderBottom: "1px dashed rgba(253, 248, 241, 0.15)", paddingBottom: "0.4rem" }}>
                          <span>Mandatory GST (5%):</span>
                          <span style={{ fontWeight: 600 }}>₹{gst.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="price-ledger-row" style={{ color: "#fff", fontWeight: 600, marginTop: "0.4rem" }}>
                          <span>Total Booking Fare:</span>
                          <span style={{ fontWeight: 700 }}>₹{total.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="price-ledger-row" style={{ color: "#51cf66" }}>
                          <span>Confirmation Advance (50%):</span>
                          <span style={{ fontWeight: 600 }}>- ₹{advance.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="price-ledger-grand">
                          <span>Due at Check-in:</span>
                          <span>₹{due.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <button
                        id="btnProceedPayment"
                        onClick={handleInitiatePayment}
                        className="btn animate-pulse"
                        style={{ width: "100%", background: "linear-gradient(135deg, var(--gold) 0%, #a37c1d 100%)", color: "#fff", fontWeight: 600, justifyContent: "center", padding: "0.85rem", borderRadius: "50px", fontSize: "0.88rem", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "1.5rem", boxShadow: "0 4px 15px rgba(202,160,53,0.25)" }}
                      >
                        <i className="fa-solid fa-lock" style={{ marginRight: "8px" }}></i> Pay 50% Advance & Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 3: PAYMENT SCREEN & INVOICE */}
            {phase === 3 && lastBooking && (
              <div id="phase3">
                <div id="receiptFrame" className="bill-receipt-frame" style={{ background: "#fff", color: "#333", padding: "2rem", borderRadius: "12px", border: "1px solid #ddd" }}>
                  <div className="bill-receipt-header" style={{ textAlign: "center", marginBottom: "1.8rem" }}>
                    <img src="/Photos/index/logo.png" alt="Hotel Devang Logo" style={{ height: "40px", width: "40px", objectFit: "contain", margin: "0 auto 8px", display: "block" }} />
                    <span className="bill-receipt-logo" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#880000", letterSpacing: "1px" }}>HOTEL DEVANG</span>
                    <span className="bill-receipt-gst" style={{ fontFamily: "monospace", fontSize: "10px", color: "#777", display: "block", marginBottom: "2px" }}>GSTIN: 24AADFH4542D2ZU</span>
                    <span className="bill-receipt-sub" style={{ fontSize: "0.78rem", color: "#555", display: "block" }}>Opp Circuit House, Hospital Rd, Dwarka, Gujarat 361335</span>
                    <span className="bill-receipt-contact" style={{ fontSize: "0.78rem", color: "#555", display: "block" }}>Ph: +91 98244 02132 &bull; hoteldevang.com</span>
                    <div className="bill-receipt-badge-container" style={{ marginTop: "10px" }}>
                      <span className="bill-receipt-badge" style={{ background: "#880000", color: "#fff", padding: "4px 12px", borderRadius: "50px", fontSize: "0.68rem", fontWeight: 600 }}>PROVISIONAL BOOKING CONFIRMATION</span>
                    </div>
                  </div>

                  <div className="bill-receipt-meta" style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "1rem 0", marginBottom: "1.5rem", fontSize: "0.78rem" }}>
                    <div className="bill-receipt-meta-col" style={{ textAlign: "left" }}>
                      <div><span className="bill-receipt-meta-label" style={{ color: "#777" }}>Invoice ID:</span> <span className="bill-receipt-meta-val code" style={{ fontFamily: "monospace", fontWeight: 700 }}>{lastBooking.bookingId}</span></div>
                      <div><span className="bill-receipt-meta-label" style={{ color: "#777" }}>Guest Name:</span> <span className="bill-receipt-meta-val" style={{ fontWeight: 600 }}>{lastBooking.guestName}</span></div>
                      <div><span className="bill-receipt-meta-label" style={{ color: "#777" }}>Contact Phone:</span> <span className="bill-receipt-meta-val" style={{ fontWeight: 600 }}>{lastBooking.phone}</span></div>
                      <div>
                        <span className="bill-receipt-meta-label" style={{ color: "#777" }}>Date of Birth:</span>{" "}
                        <span className="bill-receipt-meta-val" style={{ fontWeight: 600 }}>
                          {new Date(lastBooking.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })}
                        </span>
                      </div>
                    </div>
                    <div className="bill-receipt-meta-col right" style={{ textAlign: "right" }}>
                      <div><span className="bill-receipt-meta-label" style={{ color: "#777" }}>Issued Date:</span> <span className="bill-receipt-meta-val" style={{ fontWeight: 600 }}>{new Date(lastBooking.createdAt || new Date()).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })}</span></div>
                      <div>
                        <span className="bill-receipt-meta-label" style={{ color: "#777" }}>Check-In:</span>{" "}
                        <span className="bill-receipt-meta-val" style={{ fontWeight: 600 }}>
                          {new Date(lastBooking.checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })}
                        </span>
                      </div>
                      <div>
                        <span className="bill-receipt-meta-label" style={{ color: "#777" }}>Check-Out:</span>{" "}
                        <span className="bill-receipt-meta-val" style={{ fontWeight: 600 }}>
                          {new Date(lastBooking.checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" })}
                        </span>
                      </div>
                      <div><span className="bill-receipt-meta-label" style={{ color: "#777" }}>Duration:</span> <span className="bill-receipt-meta-val" style={{ color: "#880000", fontWeight: 700 }}>{getNights()} Night{getNights() > 1 ? "s" : ""}</span></div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.8rem" }}>
                    <span className="bill-receipt-section-title" style={{ fontSize: "0.85rem", fontWeight: 700, borderBottom: "1.5px solid #880000", paddingBottom: "3px", display: "inline-block", marginBottom: "8px" }}>Stay Invoice Summary</span>
                    <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse", lineHeight: 1.8 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #eee", color: "#777", textAlign: "left", fontWeight: 600 }}>
                          <th style={{ paddingBottom: "0.4rem" }}>Stay Description</th>
                          <th style={{ paddingBottom: "0.4rem", textAlign: "center" }}>Nights</th>
                          <th style={{ paddingBottom: "0.4rem", textAlign: "right" }}>Price Rate</th>
                          <th style={{ paddingBottom: "0.4rem", textAlign: "right" }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody style={{ color: "#333" }}>
                        {lastBooking.rooms.map((room, idx) => {
                          const rowTotal = room.pricePerNight * room.quantity * getNights();
                          const extraMattressStr = room.guests > 2 && room.roomType !== "Standard" ? ` + ${room.guests - 2} Extra Mattress` : "";
                          return (
                            <tr key={idx} style={{ borderBottom: "1px solid #f9f9f9" }}>
                              <td style={{ padding: "0.5rem 0" }}>
                                {room.quantity}x {room.roomType} ({room.selectedSubtype}) {extraMattressStr}
                              </td>
                              <td style={{ padding: "0.5rem 0", textAlign: "center" }}>{getNights()}</td>
                              <td style={{ padding: "0.5rem 0", textAlign: "right" }}>₹{room.pricePerNight.toLocaleString("en-IN")}</td>
                              <td style={{ padding: "0.5rem 0", textAlign: "right", fontWeight: 600 }}>₹{rowTotal.toLocaleString("en-IN")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ borderTop: "1.5px solid #eee", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.8rem", color: "#333", lineHeight: 1.5 }}>
                    <div style={{ display: "flex", justifycontent: "space-between", justifyContent: "space-between", fontWeight: 500 }}>
                      <span>Room Tariff Subtotal:</span>
                      <span style={{ color: "#000", fontWeight: 600 }}>₹{lastBooking.rooms.reduce((sum, r) => sum + r.pricePerNight * r.quantity * getNights(), 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, borderBottom: "1px dashed #eee", paddingBottom: "0.4rem" }}>
                      <span>Mandatory GST (5%):</span>
                      <span style={{ color: "#000", fontWeight: 600 }}>₹{Math.ceil(lastBooking.rooms.reduce((sum, r) => sum + r.pricePerNight * r.quantity * getNights(), 0) * 0.05).toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginTop: "0.2rem" }}>
                      <span>Total Booking Fare (Sum Stay Tariff):</span>
                      <span style={{ color: "#000", fontWeight: 700 }}>₹{lastBooking.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#1e7e34", fontWeight: 500 }}>
                      <span>Advance Paid (Razorpay Online Checkout):</span>
                      <span style={{ fontWeight: 600 }}>- ₹{lastBooking.paidAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#880000", fontWeight: 700, borderTop: "2px double #ddd", paddingTop: "0.6rem", marginTop: "0.2rem", fontSize: "0.95rem" }}>
                      <span>BALANCE PAYABLE AT CHECK-IN:</span>
                      <span style={{ fontWeight: 700 }}>₹{lastBooking.dueAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div style={{ borderTop: "1px dashed #eee", paddingTop: "0.6rem", marginTop: "0.6rem", fontSize: "0.72rem", lineHeight: 1.4, color: "#444" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span style={{ fontWeight: 600, color: "#555" }}>Check-In Time:</span>
                        <span style={{ fontWeight: 600, color: "#000" }}>12:30 PM onwards</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                        <span style={{ fontWeight: 600, color: "#555" }}>Check-Out Time:</span>
                        <span style={{ fontWeight: 600, color: "#000" }}>10:00 AM (Next Day)</span>
                      </div>
                      <p style={{ fontSize: "0.65rem", color: "#777", fontStyle: "italic", margin: "4px 0 0 0", lineHeight: 1.3 }}>
                        * Note: 24-hour stay/booking service is not available. Standard check-in and check-out timings apply strictly.
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: "2.2rem", borderTop: "1px solid #f0f0f0", paddingTop: "1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>
                    <div style={{ fontSize: "0.72rem", color: "#888", maxWidth: "240px", lineHeight: 1.4 }}>
                      * GST is compulsory for room booking purposes. This provisional receipt represents a dynamic booking confirmation. Please present this document or booking code during check-in at reception.
                    </div>
                    <div className="bill-receipt-stamp" style={{ border: "2px dashed #1e7e34", color: "#1e7e34", transform: "rotate(-10deg)", padding: "5px 12px", fontWeight: 700, borderRadius: "5px", textTransform: "uppercase" }}>
                      <span style={{ fontSize: "0.58rem", letterSpacing: "0.5px", display: "block", textAlign: "center" }}>HOTEL DEVANG DWARKA</span>
                      <span style={{ display: "block", textAlign: "center", fontSize: "0.9rem" }}>CONFIRMED</span>
                    </div>
                  </div>
                </div>

                {/* Print/Download controls */}
                <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
                  <button onClick={handleDownloadPDF} className="btn" style={{ background: "#222", color: "#fff", fontWeight: 600, padding: "0.8rem 1.8rem", borderRadius: "50px", fontSize: "0.85rem", border: "1px solid #444" }}>
                    <i className="fa-solid fa-print"></i> Print / Download PDF
                  </button>
                  <button onClick={handleWhatsAppRedirect} className="btn" style={{ background: "#25d366", color: "#fff", fontWeight: 600, padding: "0.8rem 1.8rem", borderRadius: "50px", fontSize: "0.85rem", border: "none", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <i className="fa-brands fa-whatsapp" style={{ fontSize: "1.1rem" }}></i> Receive Receipt on WhatsApp
                  </button>
                  <button onClick={() => setPhase(1)} className="btn" style={{ background: "linear-gradient(135deg, var(--crimson) 0%, #aa0000 100%)", color: "#fff", fontWeight: 600, padding: "0.8rem 1.8rem", borderRadius: "50px", fontSize: "0.85rem" }}>
                    Book Another Stay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="booking-modal-overlay active show" style={{ display: "flex" }}>
          <div className="booking-modal-container">
            <div className="booking-modal-header">
              <h3 className="booking-modal-title">
                <i className="fa-solid fa-hotel" style={{ color: "var(--gold)" }}></i> Confirm Booking Details
              </h3>
              <button type="button" className="booking-modal-close" onClick={() => setShowConfirmModal(false)}>&times;</button>
            </div>
            <div className="booking-modal-body">
              {/* Stay Duration */}
              <div className="modal-info-card">
                <div className="modal-card-title"><i className="fa-solid fa-calendar-days"></i> Stay Duration</div>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-lbl">Check-In Date</span>
                    <span className="modal-detail-val">
                      {checkInVal ? new Date(checkInVal).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "--/--/----"}
                    </span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-lbl">Check-Out Date</span>
                    <span className="modal-detail-val">
                      {checkOutVal ? new Date(checkOutVal).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "--/--/----"}
                    </span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-lbl">Total Nights</span>
                    <span className="modal-detail-val important">{getNights()}</span>
                  </div>
                </div>
              </div>

              {/* Guest Details */}
              <div className="modal-info-card">
                <div className="modal-card-title"><i className="fa-solid fa-user-check"></i> Guest Information</div>
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <span className="modal-detail-lbl">Primary Guest Name</span>
                    <span className="modal-detail-val">{guestName}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-lbl">Contact Number</span>
                    <span className="modal-detail-val">{guestPhone}</span>
                  </div>
                  <div className="modal-detail-item">
                    <span className="modal-detail-lbl">Date of Birth</span>
                    <span className="modal-detail-val">
                      {guestDob ? new Date(guestDob).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "--/--/----"}
                    </span>
                  </div>
                  <div className="modal-detail-item" style={{ gridColumn: "span 2" }}>
                    <span className="modal-detail-lbl">Special Requests</span>
                    <span className="modal-detail-val">{specialRequests || "None"}</span>
                  </div>
                </div>
              </div>

              {/* Selected Rooms */}
              <div className="modal-info-card">
                <div className="modal-card-title"><i className="fa-solid fa-bed"></i> Selected Rooms</div>
                <div className="modal-room-list">
                  {estimatedItems.map((room, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem", borderBottom: "1px dashed rgba(0,0,0,0.05)", paddingBottom: "0.2rem", color: "#333" }}>
                      <span>
                        {room.quantity}x {room.name} ({room.subtype})
                      </span>
                      <span style={{ fontWeight: 600 }}>₹{room.rowTotal.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ledger */}
              <div className="modal-ledger">
                <div className="modal-ledger-row">
                  <span>Room Tariff Subtotal:</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="modal-ledger-row">
                  <span>Mandatory GST (5%):</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="modal-ledger-row bold">
                  <span>Total Stay Tariff:</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="modal-ledger-row success bold">
                  <span>50% Advance Online Payment:</span>
                  <span>₹{advance.toLocaleString("en-IN")}</span>
                </div>
                <div className="modal-ledger-grand">
                  <span>Due at Check-in:</span>
                  <span>₹{due.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-modal-cancel" onClick={() => setShowConfirmModal(false)}>
                <i className="fa-solid fa-arrow-left"></i> Go Back & Edit
              </button>
              <button type="button" className="btn btn-modal-confirm" id="btnModalConfirmPay" onClick={executeRazorpayGateway} disabled={isProcessingOrder}>
                {isProcessingOrder ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-shield-halved"></i> Confirm & Proceed to Pay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NO VACANCY MODAL */}
      {showNoVacancyModal && (
        <div className="booking-modal-overlay active show" style={{ display: "flex" }}>
          <div className="booking-modal-container" style={{ maxWidth: "500px" }}>
            <div className="booking-modal-header" style={{ background: "linear-gradient(135deg, #2b0808 0%, #150202 100%)", borderBottom: "1px solid rgba(239, 68, 68, 0.3)" }}>
              <h3 className="booking-modal-title" style={{ color: "#ff4d4d" }}>
                <i className="fa-solid fa-circle-xmark" style={{ color: "#ff4d4d", fontSize: "1.6rem" }}></i> Dates Unavailable
              </h3>
              <button type="button" className="booking-modal-close" onClick={() => setShowNoVacancyModal(false)}>&times;</button>
            </div>
            <div className="booking-modal-body" style={{ textAlign: "center", padding: "2.2rem 2rem 1.8rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
              <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1.5px solid rgba(239, 68, 68, 0.25)", borderRadius: "50%", width: "80px", height: "80px", display: "flex", alignItems: "center", justifyCenter: "center", marginBottom: "0.5rem", boxShadow: "0 8px 24px rgba(239, 68, 68, 0.15)", justifyContent: "center" }}>
                <i className="fa-solid fa-calendar-xmark" style={{ color: "#ff4d4d", fontSize: "2.5rem" }}></i>
              </div>
              <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.25rem", color: "#fff", fontWeight: 600, margin: 0 }}>No Vacancy for Selected Dates</h4>
              <p style={{ fontSize: "0.9rem", color: "rgba(253, 248, 241, 0.75)", lineHeight: 1.6, margin: 0, maxWidth: "360px" }}>
                We are fully booked for the stay duration you requested. Please try selecting different dates.
              </p>
              <div style={{ background: "rgba(202, 160, 53, 0.04)", border: "1px solid rgba(202, 160, 53, 0.15)", borderRadius: "10px", padding: "0.8rem 1.2rem", width: "100%", textAlign: "left", boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, letterSpacing: "0.05em", marginBottom: "4px" }}>Requested Stay Period</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>
                  {checkInVal ? new Date(checkInVal).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "dd/mm/yyyy"}{" "}
                  to {checkOutVal ? new Date(checkOutVal).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }) : "dd/mm/yyyy"}
                </div>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(253, 248, 241, 0.55)", lineHeight: 1.5, margin: 0 }}>
                Tip: Look for dates marked in <span style={{ color: "#51cf66", fontWeight: 600 }}>green</span> (available) or <span style={{ color: "var(--gold-light)", fontWeight: 600 }}>amber</span> (partially booked) on the calendar.
              </p>
            </div>
            <div className="modal-footer" style={{ background: "rgba(15, 3, 3, 0.5)", padding: "1.2rem 2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button type="button" className="btn" style={{ background: "linear-gradient(135deg, #ff4d4d 0%, #aa0000 100%)", boxShadow: "0 4px 16px rgba(239, 68, 68, 0.3)", border: "none", width: "100%", justifyContent: "center", fontWeight: 600, color: "#fff" }} onClick={() => setShowNoVacancyModal(false)}>
                <i className="fa-solid fa-calendar-days"></i> Select Different Dates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
