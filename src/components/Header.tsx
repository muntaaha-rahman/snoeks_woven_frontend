import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.jpeg";
import { useI18n } from "../i18n/I18nContext";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";

export function Header() {
  const { t } = useI18n();
  return (
    <header className="app-header">
      <div className="brandrow">
        <div className="brandmark">
          <img src={logo} alt="Snoeks Wonen" className="logo-img" />
          <span className="brand-sub">{t("brand.sub")}</span>
        </div>
        <nav className="tabs">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav.overview")}
          </NavLink>
          <NavLink to="/visits/new" className={({ isActive }) => (isActive ? "active" : "")}>
            {t("nav.new")}
          </NavLink>
        </nav>
        <LanguageSwitcher />
      </div>
      <div className="ruler" />
    </header>
  );
}
