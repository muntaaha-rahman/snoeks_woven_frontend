import type { FlooringSection } from "../api/types";
import { PhotoPicker } from "./PhotoPicker";
import { CheckboxField, NoteField, NumberField, SelectField, TextField } from "./fields";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  item: FlooringSection;
  onChange: (item: FlooringSection) => void;
  onRemove: () => void;
}

export function FlooringSectionForm({ item, onChange, onRemove }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof FlooringSection>(key: K, value: FlooringSection[K]) =>
    onChange({ ...item, [key]: value });

  const area = item.length_m > 0 && item.width_m > 0 ? (item.length_m * item.width_m).toFixed(2) : "-";

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>{t("item.flooring")}</h4>
        <button type="button" className="remove-button" onClick={onRemove}>{t("common.remove")}</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label={t("f.lengthM")} value={item.length_m} onChange={(v) => set("length_m", v)} />
          <NumberField label={t("f.widthM")} value={item.width_m} onChange={(v) => set("width_m", v)} />
          <div className="computed-field">
            <span>{t("f.area")}</span>
            <strong>{area}</strong>
          </div>
          <SelectField
            label={t("f.subfloor")}
            value={item.subfloor_type}
            onChange={(v) => set("subfloor_type", v as FlooringSection["subfloor_type"])}
            options={[
              { value: "concrete", label: t("o.concrete") },
              { value: "wood", label: t("o.wood") },
              { value: "tile", label: t("o.tile") },
              { value: "existing_floor_covering", label: t("o.existing_floor_covering") },
            ]}
          />
          <CheckboxField label={t("f.levelling")} value={item.levelling_required} onChange={(v) => set("levelling_required", v)} />
          <CheckboxField label={t("f.underfloor")} value={item.underfloor_heating_present} onChange={(v) => set("underfloor_heating_present", v)} />
          <TextField label={t("f.laying")} value={item.laying_direction} onChange={(v) => set("laying_direction", v)} />
          <TextField label={t("f.sound")} value={item.sound_insulation_requirement} onChange={(v) => set("sound_insulation_requirement", v)} />
          <NoteField label={t("common.note")} value={item.note} onChange={(v) => set("note", v)} />
        </div>
        <div className="item-side">
          <PhotoPicker
            savedPhotos={item.photos ?? []}
            stagedPhotos={item.new_photos ?? []}
            onStagedPhotosChange={(photos) => set("new_photos", photos)}
          />
        </div>
      </div>
    </div>
  );
}
