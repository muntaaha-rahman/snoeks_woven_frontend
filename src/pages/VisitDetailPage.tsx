import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteVisit, fileUrl, getVisit, pdfUrl, resendEmail } from "../api/client";
import type { Visit } from "../api/types";
import { useI18n } from "../i18n/I18nContext";
import type { TranslationKey } from "../i18n/translations";

export function VisitDetailPage() {
  const { t } = useI18n();
  const opt = (v: string) => (v ? t(`o.${v}` as TranslationKey) : "");
  const { visitId } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  function load() {
    if (!visitId) return;
    setLoading(true);
    getVisit(visitId)
      .then(setVisit)
      .catch(() => setError(t("detail.loadError")))
      .finally(() => setLoading(false));
  }

  useEffect(load, [visitId]);

  async function handleRetry() {
    if (!visitId) return;
    setRetrying(true);
    try {
      setVisit(await resendEmail(visitId));
    } finally {
      setRetrying(false);
    }
  }

  async function handleDelete() {
    if (!visitId || !confirm(t("detail.confirmDelete"))) return;
    await deleteVisit(visitId);
    navigate("/");
  }

  if (loading) return <div className="page">{t("common.loading")}</div>;
  if (error || !visit) return <div className="page error-text">{error ?? t("detail.notFound")}</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ marginTop: 24 }}>
        <h1>{visit.customer_name}</h1>
        <div className="page-actions">
          <Link to={`/visits/${visit.id}/edit`} className="ghost-button">{t("common.edit")}</Link>
          <a href={pdfUrl(visit.id)} target="_blank" rel="noreferrer" className="ghost-button">{t("detail.viewPdf")}</a>
          <button type="button" onClick={handleDelete} className="remove-button">{t("common.delete")}</button>
        </div>
      </div>

      {visit.email_sent ? (
        <div className="banner banner-success">{t("detail.emailed")}</div>
      ) : (
        <div className="banner banner-warning">
          {t("detail.emailFailed")}{visit.email_error ? `: ${visit.email_error}` : ""}.
          <button type="button" onClick={handleRetry} disabled={retrying}>
            {retrying ? t("detail.retrying") : t("detail.retry")}
          </button>
        </div>
      )}

      <section className="customer-summary">
        <div><strong>{t("detail.address")}</strong> {visit.address}, {visit.postal_code} {visit.city}</div>
        <div><strong>{t("detail.phone")}</strong> {visit.phone}</div>
        <div><strong>{t("detail.email")}</strong> {visit.email}</div>
        <div><strong>{t("detail.date")}</strong> {visit.visit_date}</div>
        <div><strong>{t("detail.surveyor")}</strong> {visit.surveyor_name}</div>
        {visit.property_notes && <div><strong>{t("detail.notes")}</strong> {visit.property_notes}</div>}
      </section>

      {visit.rooms.map((room) => (
        <section key={room.id} className="room-summary">
          <h2>{room.name}</h2>

          {room.window_treatments.length > 0 && (
            <div className="summary-block">
              <h3>{t("cat.window")}</h3>
              {room.window_treatments.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.width_mm} x {item.height_mm} mm - {opt(item.product)} - {item.fabric_colour_sample}
                  {item.photos && item.photos.length > 0 && (
                    <div className="photo-thumbs">
                      {item.photos.map((p) => <img key={p.id} src={fileUrl(p.file_path)} alt="" className="photo-thumb" />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {room.flooring_sections.length > 0 && (
            <div className="summary-block">
              <h3>{t("cat.flooring")}</h3>
              {room.flooring_sections.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.length_m} x {item.width_m} m ({item.area_m2} m2) - {opt(item.subfloor_type)}
                </div>
              ))}
            </div>
          )}

          {room.insect_screens.length > 0 && (
            <div className="summary-block">
              <h3>{t("cat.insect")}</h3>
              {room.insect_screens.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.width_mm} x {item.height_mm} mm - {opt(item.mount_type === "recess" ? "recess_mount" : item.mount_type)} - {opt(item.window_door_type)}
                </div>
              ))}
            </div>
          )}

          {room.sun_shadings.length > 0 && (
            <div className="summary-block">
              <h3>{t("cat.sun")}</h3>
              {room.sun_shadings.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.width_mm} x {item.height_projection_mm} mm - {opt(item.mounting_surface)}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
