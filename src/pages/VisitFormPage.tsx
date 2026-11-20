import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createVisit, getVisit, NetworkError, updateVisit } from "../api/client";
import { emptyRoom, emptyVisit } from "../api/defaults";
import type { VisitInput } from "../api/types";
import { RoomEditor } from "../components/RoomEditor";
import { TextField } from "../components/fields";
import { queueVisit } from "../offline/queue";
import { useI18n } from "../i18n/I18nContext";

export function VisitFormPage() {
  const { t } = useI18n();
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
      .catch(() => setError(t("detail.loadError")))
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
    setVisit((v) => ({ ...v, rooms: [...v.rooms, emptyRoom(t("form.roomDefault", { n: v.rooms.length + 1 }))] }));
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
      setError(err instanceof Error ? err.message : t("form.saveError"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page">{t("common.loading")}</div>;

  return (
    <div className="page">
      <h1 style={{ marginTop: 24 }}>{isEdit ? t("form.editTitle") : t("form.newTitle")}</h1>

      <div className="section">
        <div className="ruler small" />
        <div className="section-inner">
          <h2 className="section-title">{t("form.customerDetails")}</h2>
          <div className="customer-form">
            <TextField label={t("form.customerName")} value={visit.customer_name} onChange={(v) => set("customer_name", v)} />
            <TextField label={t("form.address")} value={visit.address} onChange={(v) => set("address", v)} />
            <TextField label={t("form.postalCode")} value={visit.postal_code} onChange={(v) => set("postal_code", v)} />
            <TextField label={t("form.city")} value={visit.city} onChange={(v) => set("city", v)} />
            <TextField label={t("form.phone")} value={visit.phone} onChange={(v) => set("phone", v)} />
            <TextField label={t("form.email")} value={visit.email} onChange={(v) => set("email", v)} />
            <label className="field">
              <span>{t("form.date")}</span>
              <input type="date" value={visit.visit_date} onChange={(e) => set("visit_date", e.target.value)} />
            </label>
            <TextField label={t("form.surveyor")} value={visit.surveyor_name} onChange={(v) => set("surveyor_name", v)} />
            <TextField label={t("form.propertyNotes")} value={visit.property_notes} onChange={(v) => set("property_notes", v)} />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="ruler small" />
        <div className="section-inner">
          <h2 className="section-title">
            {t("form.rooms")}
            <button type="button" className="ghost-button" onClick={addRoom}>{t("form.addRoom")}</button>
          </h2>
          {visit.rooms.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {t("form.noRooms")}
            </p>
          )}
          {visit.rooms.map((room, i) => (
            <RoomEditor key={i} room={room} onChange={(r) => replaceRoom(i, r)} onRemove={() => removeRoom(i)} />
          ))}
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="form-actions">
        <button type="button" className="ghost-button" onClick={() => navigate(-1)} disabled={saving}>
          {t("common.cancel")}
        </button>
        <button type="button" className="primary-button" onClick={handleSubmit} disabled={saving}>
          {saving ? t("form.saving") : t("form.save")}
        </button>
      </div>
    </div>
  );
}
