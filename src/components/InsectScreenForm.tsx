import type { InsectScreen } from "../api/types";
import { MeasurementDrawing } from "./MeasurementDrawing";
import { PhotoPicker } from "./PhotoPicker";
import { NoteField, NumberField, OptionalNumberField, SelectField, TextField } from "./fields";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  item: InsectScreen;
  onChange: (item: InsectScreen) => void;
  onRemove: () => void;
}

export function InsectScreenForm({ item, onChange, onRemove }: Props) {
  const { t } = useI18n();
  const set = <K extends keyof InsectScreen>(key: K, value: InsectScreen[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>{t("item.insect")}</h4>
        <button type="button" className="remove-button" onClick={onRemove}>{t("common.remove")}</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label={t("f.widthMm")} value={item.width_mm} onChange={(v) => set("width_mm", v)} />
          <NumberField label={t("f.heightMm")} value={item.height_mm} onChange={(v) => set("height_mm", v)} />
          <SelectField
            label={t("f.mountType")}
            value={item.mount_type}
            onChange={(v) => set("mount_type", v as InsectScreen["mount_type"])}
            options={[
              { value: "surface", label: t("o.surface") },
              { value: "recess", label: t("o.recess_mount") },
            ]}
          />
          <SelectField
            label={t("f.windowDoorType")}
            value={item.window_door_type}
            onChange={(v) => set("window_door_type", v as InsectScreen["window_door_type"])}
            options={[
              { value: "turn_window", label: t("o.turn_window") },
              { value: "sliding_window", label: t("o.sliding_window") },
              { value: "door", label: t("o.door") },
              { value: "roof_window", label: t("o.roof_window") },
            ]}
          />
          <TextField label={t("f.openingDirection")} value={item.opening_direction} onChange={(v) => set("opening_direction", v)} />
          <OptionalNumberField label={t("f.reveal")} value={item.frame_reveal_depth_mm} onChange={(v) => set("frame_reveal_depth_mm", v)} />
          <TextField label={t("f.profileColour")} value={item.profile_colour} onChange={(v) => set("profile_colour", v)} />
          <TextField label={t("f.mesh")} value={item.mesh_sample} onChange={(v) => set("mesh_sample", v)} />
          <SelectField
            label={t("f.operatingSide")}
            value={item.operating_side}
            onChange={(v) => set("operating_side", v as InsectScreen["operating_side"])}
            options={[{ value: "left", label: t("o.left") }, { value: "right", label: t("o.right") }]}
          />
          <TextField label={t("f.mountingSurface")} value={item.mounting_surface} onChange={(v) => set("mounting_surface", v)} />
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
