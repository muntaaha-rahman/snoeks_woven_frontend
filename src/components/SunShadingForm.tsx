import type { SunShading } from "../api/types";
import { MeasurementDrawing } from "./MeasurementDrawing";
import { PhotoPicker } from "./PhotoPicker";
import { NoteField, NumberField, OptionalNumberField, SelectField, TextField } from "./fields";

interface Props {
  item: SunShading;
  onChange: (item: SunShading) => void;
  onRemove: () => void;
}

export function SunShadingForm({ item, onChange, onRemove }: Props) {
  const set = <K extends keyof SunShading>(key: K, value: SunShading[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>Sun shading</h4>
        <button type="button" className="remove-button" onClick={onRemove}>Remove</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label="Width (mm)" value={item.width_mm} onChange={(v) => set("width_mm", v)} />
          <NumberField label="Height / projection (mm)" value={item.height_projection_mm} onChange={(v) => set("height_projection_mm", v)} />
          <SelectField
            label="Mounting surface"
            value={item.mounting_surface}
            onChange={(v) => set("mounting_surface", v as SunShading["mounting_surface"])}
            options={[
              { value: "masonry_concrete", label: "Masonry / concrete" },
              { value: "timber_facade", label: "Timber facade" },
              { value: "under_gutter", label: "Under gutter" },
              { value: "frame", label: "Frame" },
            ]}
          />
          <NoteField label="Obstacles" value={item.obstacles} onChange={(v) => set("obstacles", v)} />
          <TextField label="Wind resistance" value={item.wind_resistance} onChange={(v) => set("wind_resistance", v)} />
          <TextField label="Fabric colour (sample no.)" value={item.fabric_colour_sample} onChange={(v) => set("fabric_colour_sample", v)} />
          <TextField label="Housing & arm colour (sample no.)" value={item.housing_arm_colour_sample} onChange={(v) => set("housing_arm_colour_sample", v)} />
          <OptionalNumberField label="Mounting height (mm)" value={item.mounting_height_mm} onChange={(v) => set("mounting_height_mm", v)} />
          <NoteField label="Note" value={item.note} onChange={(v) => set("note", v)} />
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
