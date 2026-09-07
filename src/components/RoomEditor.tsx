import {
  emptyFlooringSection,
  emptyInsectScreen,
  emptySunShading,
  emptyWindowTreatment,
} from "../api/defaults";
import type { Room } from "../api/types";
import { FlooringSectionForm } from "./FlooringSectionForm";
import { InsectScreenForm } from "./InsectScreenForm";
import { SunShadingForm } from "./SunShadingForm";
import { TextField } from "./fields";
import { WindowTreatmentForm } from "./WindowTreatmentForm";

interface Props {
  room: Room;
  onChange: (room: Room) => void;
  onRemove: () => void;
}

function replaceAt<T>(arr: T[], index: number, value: T): T[] {
  return arr.map((item, i) => (i === index ? value : item));
}

function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

export function RoomEditor({ room, onChange, onRemove }: Props) {
  return (
    <section className="room-editor">
      <div className="room-editor-header">
        <TextField label="Room name" value={room.name} onChange={(name) => onChange({ ...room, name })} />
        <button type="button" className="remove-button" onClick={onRemove}>Remove room</button>
      </div>

      <div className="category-section">
        <div className="category-header">
          <h3>Window treatments</h3>
          <button
            type="button"
            onClick={() =>
              onChange({ ...room, window_treatments: [...room.window_treatments, emptyWindowTreatment()] })
            }
          >
            + Add window treatment
          </button>
        </div>
        {room.window_treatments.map((item, i) => (
          <WindowTreatmentForm
            key={i}
            item={item}
            onChange={(updated) => onChange({ ...room, window_treatments: replaceAt(room.window_treatments, i, updated) })}
            onRemove={() => onChange({ ...room, window_treatments: removeAt(room.window_treatments, i) })}
          />
        ))}
      </div>

      <div className="category-section">
        <div className="category-header">
          <h3>Flooring</h3>
          <button
            type="button"
            onClick={() => onChange({ ...room, flooring_sections: [...room.flooring_sections, emptyFlooringSection()] })}
          >
            + Add flooring section
          </button>
        </div>
        {room.flooring_sections.map((item, i) => (
          <FlooringSectionForm
            key={i}
            item={item}
            onChange={(updated) => onChange({ ...room, flooring_sections: replaceAt(room.flooring_sections, i, updated) })}
            onRemove={() => onChange({ ...room, flooring_sections: removeAt(room.flooring_sections, i) })}
          />
        ))}
      </div>

      <div className="category-section">
        <div className="category-header">
          <h3>Insect screens</h3>
          <button
            type="button"
            onClick={() => onChange({ ...room, insect_screens: [...room.insect_screens, emptyInsectScreen()] })}
          >
            + Add insect screen
          </button>
        </div>
        {room.insect_screens.map((item, i) => (
          <InsectScreenForm
            key={i}
            item={item}
            onChange={(updated) => onChange({ ...room, insect_screens: replaceAt(room.insect_screens, i, updated) })}
            onRemove={() => onChange({ ...room, insect_screens: removeAt(room.insect_screens, i) })}
          />
        ))}
      </div>

      <div className="category-section">
        <div className="category-header">
          <h3>Sun shading</h3>
          <button
            type="button"
            onClick={() => onChange({ ...room, sun_shadings: [...room.sun_shadings, emptySunShading()] })}
          >
            + Add sun shading
          </button>
        </div>
        {room.sun_shadings.map((item, i) => (
          <SunShadingForm
            key={i}
            item={item}
            onChange={(updated) => onChange({ ...room, sun_shadings: replaceAt(room.sun_shadings, i, updated) })}
            onRemove={() => onChange({ ...room, sun_shadings: removeAt(room.sun_shadings, i) })}
          />
        ))}
      </div>
    </section>
  );
}
