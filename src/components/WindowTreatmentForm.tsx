import type { WindowTreatment } from "../api/types";
import { MeasurementDrawing } from "./MeasurementDrawing";
import { PhotoPicker } from "./PhotoPicker";
import { NoteField, NumberField, OptionalNumberField, SelectField, TextField } from "./fields";

interface Props {
  item: WindowTreatment;
  onChange: (item: WindowTreatment) => void;
  onRemove: () => void;
}

export function WindowTreatmentForm({ item, onChange, onRemove }: Props) {
  const set = <K extends keyof WindowTreatment>(key: K, value: WindowTreatment[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>Window treatment</h4>
        <button type="button" className="remove-button" onClick={onRemove}>Remove</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label="Width (mm)" value={item.width_mm} onChange={(v) => set("width_mm", v)} />
          <NumberField label="Height (mm)" value={item.height_mm} onChange={(v) => set("height_mm", v)} />
          <SelectField
            label="Product"
            value={item.product}
            onChange={(v) => set("product", v as WindowTreatment["product"])}
            options={[
              { value: "curtain", label: "Curtain" },
              { value: "roller_blind", label: "Roller blind" },
              { value: "pleated_blind", label: "Pleated blind" },
              { value: "venetian_blind", label: "Venetian blind" },
            ]}
          />
          <TextField label="Fabric / colour (sample no.)" value={item.fabric_colour_sample} onChange={(v) => set("fabric_colour_sample", v)} />
          <OptionalNumberField label="Frame reveal depth (mm)" value={item.frame_reveal_depth_mm} onChange={(v) => set("frame_reveal_depth_mm", v)} />
          <SelectField
            label="Operating side"
            value={item.operating_side}
            onChange={(v) => set("operating_side", v as WindowTreatment["operating_side"])}
            options={[{ value: "left", label: "Left" }, { value: "right", label: "Right" }]}
          />
          <SelectField
            label="Operating type"
            value={item.operating_type}
            onChange={(v) => set("operating_type", v as WindowTreatment["operating_type"])}
            options={[
              { value: "chain", label: "Chain" },
              { value: "cordless", label: "Cordless" },
              { value: "handle", label: "Handle" },
              { value: "motorised", label: "Motorised" },
            ]}
          />
          <TextField label="Profile colour" value={item.profile_colour} onChange={(v) => set("profile_colour", v)} />
          <SelectField
            label="Window opening direction"
            value={item.window_opening_direction}
            onChange={(v) => set("window_opening_direction", v as WindowTreatment["window_opening_direction"])}
            options={[
              { value: "fixed", label: "Fixed" },
              { value: "tilt_and_turn", label: "Tilt-and-turn" },
              { value: "inward", label: "Inward" },
              { value: "outward", label: "Outward" },
            ]}
          />
          <SelectField
            label="Mounting"
            value={item.mounting}
            onChange={(v) => set("mounting", v as WindowTreatment["mounting"])}
            options={[
              { value: "wall", label: "Wall" },
              { value: "ceiling", label: "Ceiling" },
              { value: "recess", label: "Recess" },
            ]}
          />
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
