import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listVisits, type VisitFilters } from "../api/client";
import type { VisitListItem } from "../api/types";
import { flushQueue } from "../offline/queue";
import { useOnlineStatus } from "../offline/useOnlineStatus";
import { useQueuedCount } from "../offline/useQueuedCount";

export function VisitListPage() {
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [filters, setFilters] = useState<VisitFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const online = useOnlineStatus();
  const queuedCount = useQueuedCount();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setVisits(await listVisits(filters));
    } catch {
      setError("Could not load measurements. You may be offline.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Measurements</h1>
        <Link to="/visits/new" className="primary-button">+ New measurement</Link>
      </div>

      {!online && (
        <div className="banner banner-warning">
          You're offline. New measurements will be saved on this device and sent once you're back online.
        </div>
      )}
      {online && queuedCount > 0 && (
        <div className="banner banner-info">
          {queuedCount} measurement{queuedCount > 1 ? "s" : ""} waiting to sync.
          <button type="button" onClick={() => flushQueue()}>Sync now</button>
        </div>
      )}

      <form
        className="filter-bar"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <input
          placeholder="Search customer, address, city..."
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          placeholder="City"
          value={filters.city ?? ""}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          placeholder="Surveyor"
          value={filters.surveyor_name ?? ""}
          onChange={(e) => setFilters({ ...filters, surveyor_name: e.target.value })}
        />
        <input
          type="date"
          value={filters.date_from ?? ""}
          onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
        />
        <input
          type="date"
          value={filters.date_to ?? ""}
          onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
        />
        <button type="submit">Filter</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <table className="visit-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Address</th>
            <th>City</th>
            <th>Surveyor</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v) => (
            <tr key={v.id}>
              <td>{v.visit_date}</td>
              <td><Link to={`/visits/${v.id}`}>{v.customer_name}</Link></td>
              <td>{v.address}</td>
              <td>{v.city}</td>
              <td>{v.surveyor_name}</td>
              <td>{v.email_sent ? "Sent" : "Failed"}</td>
            </tr>
          ))}
          {!loading && visits.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-row">No measurements found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
