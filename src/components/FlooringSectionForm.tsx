import type { FlooringSection } from "../api/types";
import { PhotoPicker } from "./PhotoPicker";
import { CheckboxField, NoteField, NumberField, SelectField, TextField } from "./fields";

interface Props {
  item: FlooringSection;
  onChange: (item: FlooringSection) => void;
  onRemove: () => void;
}

export function FlooringSectionForm({ item, onChange, onRemove }: Props) {
  const set = <K extends keyof FlooringSection>(key: K, value: FlooringSection[K]) =>
    onChange({ ...item, [key]: value });

  const area = item.length_m > 0 && item.width_m > 0 ? (item.length_m * item.width_m).toFixed(2) : "-";

  return (
    <div className="item-card">
      <div className="item-card-header">
        <h4>Flooring section</h4>
        <button type="button" className="remove-button" onClick={onRemove}>Remove</button>
      </div>
      <div className="item-card-body">
        <div className="item-fields">
          <NumberField label="Length (m)" value={item.length_m} onChange={(v) => set("length_m", v)} />
          <NumberField label="Width (m)" value={item.width_m} onChange={(v) => set("width_m", v)} />
          <div className="computed-field">
            <span>Area (m2)</span>
            <strong>{area}</strong>
          </div>
          <SelectField
            label="Subfloor type"
            value={item.subfloor_type}
            onChange={(v) => set("subfloor_type", v as FlooringSection["subfloor_type"])}
            options={[
              { value: "concrete", label: "Concrete" },
              { value: "wood", label: "Wood" },
              { value: "tile", label: "Tile" },
              { value: "existing_floor_covering", label: "Existing floor covering" },
            ]}
          />
          <CheckboxField label="Levelling required" value={item.levelling_required} onChange={(v) => set("levelling_required", v)} />
          <CheckboxField label="Underfloor heating present" value={item.underfloor_heating_present} onChange={(v) => set("underfloor_heating_present", v)} />
          <TextField label="Laying direction" value={item.laying_direction} onChange={(v) => set("laying_direction", v)} />
          <TextField label="Sound insulation requirement" value={item.sound_insulation_requirement} onChange={(v) => set("sound_insulation_requirement", v)} />
          <NoteField label="Note" value={item.note} onChange={(v) => set("note", v)} />
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
