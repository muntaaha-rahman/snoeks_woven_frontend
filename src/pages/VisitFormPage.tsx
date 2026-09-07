import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createVisit, getVisit, NetworkError, updateVisit } from "../api/client";
import { emptyRoom, emptyVisit } from "../api/defaults";
import type { VisitInput } from "../api/types";
import { RoomEditor } from "../components/RoomEditor";
import { TextField } from "../components/fields";
import { queueVisit } from "../offline/queue";

export function VisitFormPage() {
  const { visitId } = useParams();
  const isEdit = Boolean(visitId);
  const navigate = useNavigate();

  const [visit, setVisit] = useState<VisitInput>(emptyVisit());
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visitId) return;
    getVisit(visitId)
      .then(setVisit)
      .catch(() => setError("Could not load this measurement."))
      .finally(() => setLoading(false));
  }, [visitId]);

  function set<K extends keyof VisitInput>(key: K, value: VisitInput[K]) {
    setVisit((v) => ({ ...v, [key]: value }));
  }

  function replaceRoom(index: number, room: VisitInput["rooms"][number]) {
    setVisit((v) => ({ ...v, rooms: v.rooms.map((r, i) => (i === index ? room : r)) }));
  }

  function removeRoom(index: number) {
    setVisit((v) => ({ ...v, rooms: v.rooms.filter((_, i) => i !== index) }));
  }

  function addRoom() {
    setVisit((v) => ({ ...v, rooms: [...v.rooms, emptyRoom(`Room ${v.rooms.length + 1}`)] }));
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      if (isEdit && visitId) {
        const saved = await updateVisit(visitId, visit);
        navigate(`/visits/${saved.id}`);
        return;
      }
      const saved = await createVisit(visit);
      navigate(`/visits/${saved.id}`);
    } catch (err) {
      if (err instanceof NetworkError) {
        await queueVisit(visit);
        navigate("/", { state: { queued: true } });
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to save this measurement.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h1>{isEdit ? "Edit measurement" : "New measurement"}</h1>

      <section className="customer-form">
        <TextField label="Customer name" value={visit.customer_name} onChange={(v) => set("customer_name", v)} />
        <TextField label="Address" value={visit.address} onChange={(v) => set("address", v)} />
        <TextField label="Postal code" value={visit.postal_code} onChange={(v) => set("postal_code", v)} />
        <TextField label="City" value={visit.city} onChange={(v) => set("city", v)} />
        <TextField label="Phone" value={visit.phone} onChange={(v) => set("phone", v)} />
        <TextField label="Email" value={visit.email} onChange={(v) => set("email", v)} />
        <label className="field">
          <span>Date</span>
          <input type="date" value={visit.visit_date} onChange={(e) => set("visit_date", e.target.value)} />
        </label>
        <TextField label="Surveyor" value={visit.surveyor_name} onChange={(v) => set("surveyor_name", v)} />
        <TextField label="Property notes" value={visit.property_notes} onChange={(v) => set("property_notes", v)} />
      </section>

      {visit.rooms.map((room, i) => (
        <RoomEditor key={i} room={room} onChange={(r) => replaceRoom(i, r)} onRemove={() => removeRoom(i)} />
      ))}

      <button type="button" onClick={addRoom} className="add-room-button">+ Add room</button>

      {error && <p className="error-text">{error}</p>}

      <div className="form-actions">
        <button type="button" className="primary-button" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save & send report"}
        </button>
      </div>
    </div>
  );
}
