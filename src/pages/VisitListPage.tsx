import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listVisits, type VisitFilters } from "../api/client";
import type { VisitListItem } from "../api/types";
import { flushQueue } from "../offline/queue";
import { useOnlineStatus } from "../offline/useOnlineStatus";
import { useQueuedCount } from "../offline/useQueuedCount";
import { useI18n } from "../i18n/I18nContext";

export function VisitListPage() {
  const { t } = useI18n();
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
      setError(t("list.loadError"));
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
      {!online && (
        <div className="banner banner-warning">
          {t("list.offline")}
        </div>
      )}
      {online && queuedCount > 0 && (
        <div className="banner banner-info">
          {queuedCount === 1 ? t("list.queued.one") : t("list.queued.many", { n: queuedCount })}
          <button type="button" onClick={() => flushQueue()}>{t("list.syncNow")}</button>
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
          placeholder={t("list.search")}
          value={filters.search ?? ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ flex: 2, minWidth: 220 }}
        />
        <input
          placeholder={t("list.city")}
          value={filters.city ?? ""}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          placeholder={t("list.surveyor")}
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
        <button type="submit">{t("list.filter")}</button>
        <Link to="/visits/new" className="primary-button">{t("list.newBtn")}</Link>
      </form>

      <p className="datateam">{t("list.shared")}</p>

      {loading && <p>{t("common.loading")}</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && visits.length === 0 && (
        <div className="empty-state">
          <div className="big">{t("list.emptyTitle")}</div>
          <p>{t("list.emptyText")}</p>
          <Link to="/visits/new" className="primary-button">{t("list.newBtn")}</Link>
        </div>
      )}

      <div className="cards">
        {visits.map((v) => (
          <Link to={`/visits/${v.id}`} key={v.id} className="visit-card">
            <div className="ruler small" />
            <div className="visit-card-body">
              <div>
                <div className="visit-card-name">{v.customer_name}</div>
                <div className="visit-card-addr">{v.address}, {v.city}</div>
                <div className="visit-card-chips">
                  <span className={`chip ${v.email_sent ? "chip-sent" : "chip-failed"}`}>
                    {v.email_sent ? t("list.emailSent") : t("list.emailFailed")}
                  </span>
                </div>
              </div>
              <div className="visit-card-meta">
                {v.visit_date}<br />{v.surveyor_name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
