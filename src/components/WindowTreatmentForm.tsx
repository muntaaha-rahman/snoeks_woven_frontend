import type { WindowTreatment } from "../api/types";
import { MeasurementDrawing } from "./MeasurementDrawing";
import { PhotoPicker } from "./PhotoPicker";
import { NoteField, NumberField, OptionalNumberField, SelectField, TextField } from "./fields";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  item: WindowTreatment;
  onChange: (item: WindowTreatment) => void;
  onRemove: () => void;
}

export function WindowTreatmentForm({ item, onChange, onRemove }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof WindowTreatment>(key: K, value: WindowTreatment[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>{t("item.window")}</h4>
        <button type="button" className="remove-button" onClick={onRemove}>{t("common.remove")}</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label={t("f.widthMm")} value={item.width_mm} onChange={(v) => set("width_mm", v)} />
          <NumberField label={t("f.heightMm")} value={item.height_mm} onChange={(v) => set("height_mm", v)} />
          <SelectField
            label={t("f.product")}
            value={item.product}
            onChange={(v) => set("product", v as WindowTreatment["product"])}
            options={[
              { value: "curtain", label: t("o.curtain") },
              { value: "roller_blind", label: t("o.roller_blind") },
              { value: "pleated_blind", label: t("o.pleated_blind") },
              { value: "venetian_blind", label: t("o.venetian_blind") },
            ]}
          />
          <TextField label={t("f.fabricColour")} value={item.fabric_colour_sample} onChange={(v) => set("fabric_colour_sample", v)} />
          <OptionalNumberField label={t("f.reveal")} value={item.frame_reveal_depth_mm} onChange={(v) => set("frame_reveal_depth_mm", v)} />
          <SelectField
            label={t("f.operatingSide")}
            value={item.operating_side}
            onChange={(v) => set("operating_side", v as WindowTreatment["operating_side"])}
            options={[{ value: "left", label: t("o.left") }, { value: "right", label: t("o.right") }]}
          />
          <SelectField
            label={t("f.operatingType")}
            value={item.operating_type}
            onChange={(v) => set("operating_type", v as WindowTreatment["operating_type"])}
            options={[
              { value: "chain", label: t("o.chain") },
              { value: "cordless", label: t("o.cordless") },
              { value: "handle", label: t("o.handle") },
              { value: "motorised", label: t("o.motorised") },
            ]}
          />
          <TextField label={t("f.profileColour")} value={item.profile_colour} onChange={(v) => set("profile_colour", v)} />
          <SelectField
            label={t("f.windowOpening")}
            value={item.window_opening_direction}
            onChange={(v) => set("window_opening_direction", v as WindowTreatment["window_opening_direction"])}
            options={[
              { value: "fixed", label: t("o.fixed") },
              { value: "tilt_and_turn", label: t("o.tilt_and_turn") },
              { value: "inward", label: t("o.inward") },
              { value: "outward", label: t("o.outward") },
            ]}
          />
          <SelectField
            label={t("f.mounting")}
            value={item.mounting}
            onChange={(v) => set("mounting", v as WindowTreatment["mounting"])}
            options={[
              { value: "wall", label: t("o.wall") },
              { value: "ceiling", label: t("o.ceiling") },
              { value: "recess", label: t("o.recess") },
            ]}
          />
          <NoteField label={t("common.note")} value={item.note} onChange={(v) => set("note", v)} />
        </div>
        <div className="item-side">
          <MeasurementDrawing width={item.width_mm} height={item.height_mm} />
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
