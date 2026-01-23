import React, { useEffect, useMemo, useState } from "react";
import { authAPI, eventsAPI } from "../utils/api";
import "./Events.css";

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
};

const Events = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminConfigured, setAdminConfigured] = useState(false);

  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    location: "",
    startAt: "",
    endAt: ""
  });
  const [creating, setCreating] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [adminEvent, setAdminEvent] = useState(null);
  const [adminEventLoading, setAdminEventLoading] = useState(false);

  const loadAdminStatus = async () => {
    const status = await authAPI.getAdminStatus();
    if (status?.success) {
      setIsAdmin(!!status.isAdmin);
      setAdminConfigured(!!status.configured);
    }
  };

  const loadEvents = async () => {
    const response = await eventsAPI.list();
    if (response?.success) {
      setEvents(Array.isArray(response.events) ? response.events : []);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        await Promise.all([loadAdminStatus(), loadEvents()]);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load events");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!createForm.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!createForm.startAt) {
      setError("Start date/time is required");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        title: createForm.title,
        description: createForm.description,
        location: createForm.location,
        startAt: new Date(createForm.startAt).toISOString(),
        endAt: createForm.endAt ? new Date(createForm.endAt).toISOString() : null
      };

      const res = await eventsAPI.create(payload);
      if (res?.success) {
        setCreateForm({ title: "", description: "", location: "", startAt: "", endAt: "" });
        await loadEvents();
      }
    } catch (e2) {
      setError(e2?.message || "Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  const rsvp = async (eventId, status) => {
    setError("");
    try {
      const res = await eventsAPI.rsvp(eventId, status);
      if (res?.success && res.event) {
        setEvents((prev) => prev.map((ev) => (String(ev.id) === String(eventId) ? res.event : ev)));
      }
    } catch (e) {
      setError(e?.message || "Failed to RSVP");
    }
  };

  const openManage = async (eventId) => {
    setSelectedEventId(eventId);
    setAdminEvent(null);
    setAdminEventLoading(true);
    setError("");
    try {
      const res = await eventsAPI.getById(eventId);
      if (res?.success && res.event) {
        setAdminEvent(res.event);
      }
    } catch (e) {
      setError(e?.message || "Failed to load event details");
    } finally {
      setAdminEventLoading(false);
    }
  };

  const closeManage = () => {
    setSelectedEventId(null);
    setAdminEvent(null);
  };

  const adminPeople = useMemo(() => {
    if (!adminEvent) return [];

    const map = new Map();

    for (const r of adminEvent.rsvps || []) {
      const id = r?.userId?._id || r?.userId;
      if (!id) continue;
      const existing = map.get(String(id)) || {};
      map.set(String(id), {
        userId: id,
        name: r?.userId?.name || existing.name || "",
        email: r?.userId?.email || existing.email || "",
        rsvpStatus: r?.status || existing.rsvpStatus || "",
        attended: existing.attended,
        attendedMarkedAt: existing.attendedMarkedAt
      });
    }

    for (const a of adminEvent.attendance || []) {
      const id = a?.userId?._id || a?.userId;
      if (!id) continue;
      const existing = map.get(String(id)) || {};
      map.set(String(id), {
        userId: id,
        name: a?.userId?.name || existing.name || "",
        email: a?.userId?.email || existing.email || "",
        rsvpStatus: existing.rsvpStatus || "",
        attended: !!a?.attended,
        attendedMarkedAt: a?.markedAt || null
      });
    }

    return [...map.values()].sort((a, b) => {
      const an = (a.name || a.email || "").toLowerCase();
      const bn = (b.name || b.email || "").toLowerCase();
      return an.localeCompare(bn);
    });
  }, [adminEvent]);

  const adminRsvpCounts = useMemo(() => {
    if (!adminEvent) return { yes: 0, maybe: 0, no: 0, total: 0 };
    const list = Array.isArray(adminEvent.rsvps) ? adminEvent.rsvps : [];
    const yes = list.filter(r => r?.status === "yes").length;
    const maybe = list.filter(r => r?.status === "maybe").length;
    const no = list.filter(r => r?.status === "no").length;
    return { yes, maybe, no, total: list.length };
  }, [adminEvent]);

  const setAttendance = async (userId, attended) => {
    if (!adminEvent || !selectedEventId) return;
    setError("");
    try {
      const res = await eventsAPI.setAttendance(selectedEventId, [{ userId, attended }]);
      if (res?.success && res.event) {
        setAdminEvent(res.event);
      } else {
        await openManage(selectedEventId);
      }
    } catch (e) {
      setError(e?.message || "Failed to update attendance");
    }
  };

  const deleteEvent = async (eventId) => {
    setError("");
    try {
      const res = await eventsAPI.remove(eventId);
      if (res?.success) {
        await loadEvents();
        if (String(selectedEventId) === String(eventId)) {
          closeManage();
        }
      }
    } catch (e) {
      setError(e?.message || "Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="events-page">
        <div className="events-container">
          <h2>Loading events...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-container">
        <div className="events-header">
          <h1>📅 Events</h1>
          <p>RSVP and track attendance for temple / community programs.</p>
        </div>

        {error && <div className="events-error">{error}</div>}

        {isAdmin && (
          <div className="events-admin-card">
            <h2>Create Event</h2>
            <form className="events-form" onSubmit={submitCreate}>
              <div className="events-form-row">
                <div className="events-form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    id="title"
                    name="title"
                    value={createForm.title}
                    onChange={handleCreateChange}
                    placeholder="e.g., Thursday Bhagavad-gita Class"
                    disabled={creating}
                  />
                </div>
                <div className="events-form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={createForm.location}
                    onChange={handleCreateChange}
                    placeholder="e.g., ISKCON Hyderabad"
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="events-form-row">
                <div className="events-form-group">
                  <label htmlFor="startAt">Start *</label>
                  <input
                    id="startAt"
                    name="startAt"
                    type="datetime-local"
                    value={createForm.startAt}
                    onChange={handleCreateChange}
                    disabled={creating}
                  />
                </div>
                <div className="events-form-group">
                  <label htmlFor="endAt">End</label>
                  <input
                    id="endAt"
                    name="endAt"
                    type="datetime-local"
                    value={createForm.endAt}
                    onChange={handleCreateChange}
                    disabled={creating}
                  />
                </div>
              </div>

              <div className="events-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateChange}
                  placeholder="Details about the event"
                  disabled={creating}
                  rows={3}
                />
              </div>

              <button className="events-primary-btn" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>
        )}

        {!isAdmin && adminConfigured === false && (
          <div className="events-info">
            Admin features are not configured on the server.
          </div>
        )}

        <div className="events-list">
          {events.length === 0 ? (
            <div className="events-empty">No events yet.</div>
          ) : (
            events.map((ev) => (
              <div key={ev.id} className="event-card">
                <div className="event-card-header">
                  <div>
                    <h3>{ev.title}</h3>
                    <div className="event-meta">
                      <div>{formatDateTime(ev.startAt)}{ev.endAt ? ` - ${formatDateTime(ev.endAt)}` : ""}</div>
                      {ev.location ? <div>{ev.location}</div> : null}
                    </div>
                  </div>
                  {isAdmin ? (
                    <div className="event-admin-actions">
                      <button className="events-secondary-btn" onClick={() => openManage(ev.id)}>
                        Manage
                      </button>
                      <button className="events-danger-btn" onClick={() => deleteEvent(ev.id)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>

                {ev.description ? <p className="event-description">{ev.description}</p> : null}

                <div className="event-rsvp-row">
                  <div className="event-rsvp-stats">
                    Yes: {ev.rsvpCounts?.yes || 0} | Maybe: {ev.rsvpCounts?.maybe || 0} | No: {ev.rsvpCounts?.no || 0}
                  </div>
                  <div className="event-rsvp-actions">
                    <button
                      className={ev.myRsvp?.status === "yes" ? "events-primary-btn" : "events-secondary-btn"}
                      onClick={() => rsvp(ev.id, "yes")}
                    >
                      Yes
                    </button>
                    <button
                      className={ev.myRsvp?.status === "maybe" ? "events-primary-btn" : "events-secondary-btn"}
                      onClick={() => rsvp(ev.id, "maybe")}
                    >
                      Maybe
                    </button>
                    <button
                      className={ev.myRsvp?.status === "no" ? "events-primary-btn" : "events-secondary-btn"}
                      onClick={() => rsvp(ev.id, "no")}
                    >
                      No
                    </button>
                  </div>
                </div>

                {ev.myRsvp?.status ? (
                  <div className="event-my-status">
                    Your RSVP: <strong>{ev.myRsvp.status.toUpperCase()}</strong>
                  </div>
                ) : (
                  <div className="event-my-status">You have not RSVP’d yet.</div>
                )}
              </div>
            ))
          )}
        </div>

        {isAdmin && selectedEventId && (
          <div className="events-admin-modal">
            <div className="events-admin-modal-content">
              <div className="events-admin-modal-header">
                <h2>Manage Attendance</h2>
                <button className="events-secondary-btn" onClick={closeManage}>
                  Close
                </button>
              </div>

              {adminEventLoading ? (
                <div className="events-empty">Loading event details...</div>
              ) : !adminEvent ? (
                <div className="events-empty">Event not found.</div>
              ) : (
                <>
                  <div className="events-admin-event-summary">
                    <div className="events-admin-title">{adminEvent.title}</div>
                    <div className="events-admin-sub">
                      {formatDateTime(adminEvent.startAt)}{adminEvent.endAt ? ` - ${formatDateTime(adminEvent.endAt)}` : ""}
                      {adminEvent.location ? ` • ${adminEvent.location}` : ""}
                    </div>
                    <div className="events-admin-sub">
                      RSVP: Yes {adminRsvpCounts.yes} | Maybe {adminRsvpCounts.maybe} | No {adminRsvpCounts.no} (Total {adminRsvpCounts.total})
                    </div>
                  </div>

                  <div className="events-admin-table">
                    <div className="events-admin-table-head">
                      <div>Devotee</div>
                      <div>RSVP</div>
                      <div>Attended</div>
                    </div>

                    {adminPeople.length === 0 ? (
                      <div className="events-empty">No RSVPs or attendance records yet.</div>
                    ) : (
                      adminPeople.map((p) => (
                        <div key={String(p.userId)} className="events-admin-table-row">
                          <div>
                            <div className="events-admin-name">{p.name || "(no name)"}</div>
                            <div className="events-admin-email">{p.email}</div>
                          </div>
                          <div className="events-admin-rsvp">{p.rsvpStatus ? p.rsvpStatus.toUpperCase() : "-"}</div>
                          <div>
                            <label className="events-admin-checkbox">
                              <input
                                type="checkbox"
                                checked={!!p.attended}
                                onChange={(e) => setAttendance(p.userId, e.target.checked)}
                              />
                              <span>{p.attended ? "Present" : "Absent"}</span>
                            </label>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
