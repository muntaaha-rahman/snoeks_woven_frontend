import type { InsectScreen } from "../api/types";
import { MeasurementDrawing } from "./MeasurementDrawing";
import { PhotoPicker } from "./PhotoPicker";
import { NoteField, NumberField, OptionalNumberField, SelectField, TextField } from "./fields";

interface Props {
  item: InsectScreen;
  onChange: (item: InsectScreen) => void;
  onRemove: () => void;
}

export function InsectScreenForm({ item, onChange, onRemove }: Props) {
  const set = <K extends keyof InsectScreen>(key: K, value: InsectScreen[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>Insect screen</h4>
        <button type="button" className="remove-button" onClick={onRemove}>Remove</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label="Width (mm)" value={item.width_mm} onChange={(v) => set("width_mm", v)} />
          <NumberField label="Height (mm)" value={item.height_mm} onChange={(v) => set("height_mm", v)} />
          <SelectField
            label="Mount type (op de dag / in de dag)"
            value={item.mount_type}
            onChange={(v) => set("mount_type", v as InsectScreen["mount_type"])}
            options={[
              { value: "surface", label: "Surface-mounted (op de dag)" },
              { value: "recess", label: "Recess-mounted (in de dag)" },
            ]}
          />
          <SelectField
            label="Window/door type"
            value={item.window_door_type}
            onChange={(v) => set("window_door_type", v as InsectScreen["window_door_type"])}
            options={[
              { value: "turn_window", label: "Turn window" },
              { value: "sliding_window", label: "Sliding window" },
              { value: "door", label: "Door" },
              { value: "roof_window", label: "Roof window" },
            ]}
          />
          <TextField label="Opening direction" value={item.opening_direction} onChange={(v) => set("opening_direction", v)} />
          <OptionalNumberField label="Frame reveal depth (mm)" value={item.frame_reveal_depth_mm} onChange={(v) => set("frame_reveal_depth_mm", v)} />
          <TextField label="Profile colour" value={item.profile_colour} onChange={(v) => set("profile_colour", v)} />
          <TextField label="Screen mesh (sample no.)" value={item.mesh_sample} onChange={(v) => set("mesh_sample", v)} />
          <SelectField
            label="Operating side"
            value={item.operating_side}
            onChange={(v) => set("operating_side", v as InsectScreen["operating_side"])}
            options={[{ value: "left", label: "Left" }, { value: "right", label: "Right" }]}
          />
          <TextField label="Mounting surface" value={item.mounting_surface} onChange={(v) => set("mounting_surface", v)} />
          <NoteField label="Note" value={item.note} onChange={(v) => set("note", v)} />
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
