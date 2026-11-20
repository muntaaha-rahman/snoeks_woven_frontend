import type { SunShading } from "../api/types";
import { MeasurementDrawing } from "./MeasurementDrawing";
import { PhotoPicker } from "./PhotoPicker";
import { NoteField, NumberField, OptionalNumberField, SelectField, TextField } from "./fields";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  item: SunShading;
  onChange: (item: SunShading) => void;
  onRemove: () => void;
}

export function SunShadingForm({ item, onChange, onRemove }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof SunShading>(key: K, value: SunShading[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>{t("item.sun")}</h4>
        <button type="button" className="remove-button" onClick={onRemove}>{t("common.remove")}</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label={t("f.widthMm")} value={item.width_mm} onChange={(v) => set("width_mm", v)} />
          <NumberField label={t("f.heightProjection")} value={item.height_projection_mm} onChange={(v) => set("height_projection_mm", v)} />
          <SelectField
            label={t("f.mountingSurface")}
            value={item.mounting_surface}
            onChange={(v) => set("mounting_surface", v as SunShading["mounting_surface"])}
            options={[
              { value: "masonry_concrete", label: t("o.masonry_concrete") },
              { value: "timber_facade", label: t("o.timber_facade") },
              { value: "under_gutter", label: t("o.under_gutter") },
              { value: "frame", label: t("o.frame") },
            ]}
          />
          <NoteField label={t("f.obstacles")} value={item.obstacles} onChange={(v) => set("obstacles", v)} />
          <TextField label={t("f.wind")} value={item.wind_resistance} onChange={(v) => set("wind_resistance", v)} />
          <TextField label={t("f.sunFabric")} value={item.fabric_colour_sample} onChange={(v) => set("fabric_colour_sample", v)} />
          <TextField label={t("f.housingArm")} value={item.housing_arm_colour_sample} onChange={(v) => set("housing_arm_colour_sample", v)} />
          <OptionalNumberField label={t("f.mountingHeight")} value={item.mounting_height_mm} onChange={(v) => set("mounting_height_mm", v)} />
          <NoteField label={t("common.note")} value={item.note} onChange={(v) => set("note", v)} />
        </div>
        <div className="item-side">
          <MeasurementDrawing width={item.width_mm} height={item.height_projection_mm} />
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
