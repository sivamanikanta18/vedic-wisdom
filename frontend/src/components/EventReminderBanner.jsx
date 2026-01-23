import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { eventsAPI, isAuthenticated } from "../utils/api";
import "./EventReminderBanner.css";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
};

const EventReminderBanner = () => {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  const dismissedKey = useMemo(() => {
    if (!event?.id) return null;
    return `dismissed_event_${event.id}`;
  }, [event?.id]);

  const notifiedKey = useMemo(() => {
    if (!event?.id) return null;
    return `notified_event_${event.id}`;
  }, [event?.id]);

  const isDismissed = useMemo(() => {
    if (!dismissedKey) return false;
    return localStorage.getItem(dismissedKey) === "1";
  }, [dismissedKey]);

  const dismiss = () => {
    if (dismissedKey) {
      localStorage.setItem(dismissedKey, "1");
    }
    setEvent(null);
  };

  const maybeNotify = () => {
    if (!event?.id || !notifiedKey) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (localStorage.getItem(notifiedKey) === "1") return;

    try {
      const n = new Notification("📅 Upcoming event", {
        body: `${event.title} • ${formatDateTime(event.startAt)}`,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `event-${event.id}`,
        requireInteraction: false,
        silent: false
      });

      n.onclick = () => {
        window.focus();
        window.location.href = "/events";
        n.close();
      };

      localStorage.setItem(notifiedKey, "1");
      setTimeout(() => n.close(), 10000);
    } catch {
      localStorage.setItem(notifiedKey, "1");
    }
  };

  const loadUpcomingEvent = async () => {
    if (!isAuthenticated()) {
      setEvent(null);
      return;
    }

    const now = new Date();
    const to = new Date(now);
    to.setDate(to.getDate() + 7);

    const response = await eventsAPI.list(now.toISOString(), to.toISOString());
    if (!response?.success) return;

    const list = Array.isArray(response.events) ? response.events : [];
    const upcoming = list
      .map((e) => ({ ...e, startAtDate: new Date(e.startAt) }))
      .filter((e) => e.startAt && !Number.isNaN(e.startAtDate.getTime()) && e.startAtDate > now)
      .sort((a, b) => a.startAtDate - b.startAtDate)[0];

    if (!upcoming) {
      setEvent(null);
      return;
    }

    const dismissKey = `dismissed_event_${upcoming.id}`;
    if (localStorage.getItem(dismissKey) === "1") {
      setEvent(null);
      return;
    }

    setEvent({
      id: upcoming.id,
      title: upcoming.title,
      startAt: upcoming.startAt,
      location: upcoming.location
    });
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError("");
        await loadUpcomingEvent();
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "");
      }
    })();

    const intervalId = setInterval(() => {
      loadUpcomingEvent().catch(() => {});
    }, 60000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!event) return;
    if (isDismissed) return;
    maybeNotify();
  }, [event, isDismissed]);

  if (!isAuthenticated()) return null;
  if (!event) return null;
  if (isDismissed) return null;

  return (
    <div className="event-reminder">
      <div className="event-reminder-content">
        <div className="event-reminder-title">Upcoming: {event.title}</div>
        <div className="event-reminder-sub">
          {formatDateTime(event.startAt)}{event.location ? ` • ${event.location}` : ""}
        </div>
      </div>
      <div className="event-reminder-actions">
        <Link to="/events" className="event-reminder-link">Open</Link>
        <button className="event-reminder-dismiss" onClick={dismiss}>Dismiss</button>
      </div>
      {error ? <div className="event-reminder-error">{error}</div> : null}
    </div>
  );
};

export default EventReminderBanner;
