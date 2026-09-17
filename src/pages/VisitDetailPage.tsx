import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteVisit, fileUrl, getVisit, pdfUrl, resendEmail } from "../api/client";
import type { Visit } from "../api/types";

export function VisitDetailPage() {
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
      .catch(() => setError("Could not load this measurement."))
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
    if (!visitId || !confirm("Delete this measurement?")) return;
    await deleteVisit(visitId);
    navigate("/");
  }

  if (loading) return <div className="page">Loading...</div>;
  if (error || !visit) return <div className="page error-text">{error ?? "Not found"}</div>;

  return (
    <div className="page">
      <div className="page-header" style={{ marginTop: 24 }}>
        <h1>{visit.customer_name}</h1>
        <div className="page-actions">
          <Link to={`/visits/${visit.id}/edit`} className="ghost-button">Edit</Link>
          <a href={pdfUrl(visit.id)} target="_blank" rel="noreferrer" className="ghost-button">View PDF</a>
          <button type="button" onClick={handleDelete} className="remove-button">Delete</button>
        </div>
      </div>

      {visit.email_sent ? (
        <div className="banner banner-success">Report emailed to info@snoekswonen.nl</div>
      ) : (
        <div className="banner banner-warning">
          Email failed to send{visit.email_error ? `: ${visit.email_error}` : ""}.
          <button type="button" onClick={handleRetry} disabled={retrying}>
            {retrying ? "Retrying..." : "Retry"}
          </button>
        </div>
      )}

      <section className="customer-summary">
        <div><strong>Address</strong> {visit.address}, {visit.postal_code} {visit.city}</div>
        <div><strong>Phone</strong> {visit.phone}</div>
        <div><strong>Email</strong> {visit.email}</div>
        <div><strong>Date</strong> {visit.visit_date}</div>
        <div><strong>Surveyor</strong> {visit.surveyor_name}</div>
        {visit.property_notes && <div><strong>Notes</strong> {visit.property_notes}</div>}
      </section>

      {visit.rooms.map((room) => (
        <section key={room.id} className="room-summary">
          <h2>{room.name}</h2>

          {room.window_treatments.length > 0 && (
            <div className="summary-block">
              <h3>Window treatments</h3>
              {room.window_treatments.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.width_mm} x {item.height_mm} mm - {item.product} - {item.fabric_colour_sample}
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
              <h3>Flooring</h3>
              {room.flooring_sections.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.length_m} x {item.width_m} m ({item.area_m2} m2) - {item.subfloor_type}
                </div>
              ))}
            </div>
          )}

          {room.insect_screens.length > 0 && (
            <div className="summary-block">
              <h3>Insect screens</h3>
              {room.insect_screens.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.width_mm} x {item.height_mm} mm - {item.mount_type} - {item.window_door_type}
                </div>
              ))}
            </div>
          )}

          {room.sun_shadings.length > 0 && (
            <div className="summary-block">
              <h3>Sun shading</h3>
              {room.sun_shadings.map((item) => (
                <div key={item.id} className="summary-item">
                  {item.width_mm} x {item.height_projection_mm} mm - {item.mounting_surface}
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
