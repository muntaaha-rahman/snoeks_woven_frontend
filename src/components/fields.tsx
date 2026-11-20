import type { ChangeEvent } from "react";
import { useI18n } from "../i18n/I18nContext";

interface FieldProps<T> {
  label: string;
  value: T;
  onChange: (value: T) => void;
}

export function TextField({ label, value, onChange }: FieldProps<string>) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="text" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  step = "any",
}: FieldProps<number> & { step?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        value={Number.isFinite(value) && value !== 0 ? value : value === 0 ? 0 : ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </label>
  );
}

export function OptionalNumberField({ label, value, onChange }: FieldProps<number | null>) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        step="any"
        value={value ?? ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: FieldProps<string> & { options: { value: string; label: string }[] }) {
  const { t } = useI18n();
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}>
        <option value="">{t("common.select")}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({ label, value, onChange }: FieldProps<boolean>) {
  return (
    <label className="field field-checkbox">
      <input type="checkbox" checked={value} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function NoteField({ label, value, onChange }: FieldProps<string>) {
  return (
    <label className="field field-note">
      <span>{label}</span>
      <textarea value={value} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} rows={2} />
    </label>
  );
}
