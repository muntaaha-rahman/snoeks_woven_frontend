import { useI18n } from "./I18nContext";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label={t("lang.label")}>
      <button type="button" className={lang === "en" ? "active" : ""} aria-pressed={lang === "en"} onClick={() => setLang("en")}>
        EN
      </button>
      <button type="button" className={lang === "nl" ? "active" : ""} aria-pressed={lang === "nl"} onClick={() => setLang("nl")}>
        NL
      </button>
    </div>
  );
}
