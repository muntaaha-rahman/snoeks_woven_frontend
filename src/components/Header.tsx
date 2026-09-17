import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.jpeg";

export function Header() {
  return (
    <header className="app-header">
      <div className="brandrow">
        <div className="brandmark">
          <img src={logo} alt="Snoeks Wonen" className="logo-img" />
          <span className="brand-sub">Measurement module &mdash; window treatments &amp; flooring</span>
        </div>
        <nav className="tabs">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Overview
          </NavLink>
          <NavLink to="/visits/new" className={({ isActive }) => (isActive ? "active" : "")}>
            New measurement
          </NavLink>
        </nav>
      </div>
      <div className="ruler" />
    </header>
  );
}
