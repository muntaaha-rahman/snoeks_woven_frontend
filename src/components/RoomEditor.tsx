import type { ChangeEvent } from "react";
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
import { WindowTreatmentForm } from "./WindowTreatmentForm";
import { useI18n } from "../i18n/I18nContext";

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
  const { t } = useI18n();
  return (
    <section className="room-editor">
      <div className="room-editor-header">
        <input
          value={room.name}
          placeholder={t("room.namePlaceholder")}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange({ ...room, name: e.target.value })}
        />
        <button type="button" className="text-link-button" onClick={onRemove}>{t("room.remove")}</button>
      </div>

      <div className="room-editor-body">
        <div className="category-section">
          <div className="category-header">
            <span>{t("cat.window")}</span>
            <span className="rule" />
          </div>
          {room.window_treatments.map((item, i) => (
            <WindowTreatmentForm
              key={i}
              item={item}
              onChange={(updated) => onChange({ ...room, window_treatments: replaceAt(room.window_treatments, i, updated) })}
              onRemove={() => onChange({ ...room, window_treatments: removeAt(room.window_treatments, i) })}
            />
          ))}
          <button
            type="button"
            className="add-item-button"
            onClick={() =>
              onChange({ ...room, window_treatments: [...room.window_treatments, emptyWindowTreatment()] })
            }
          >
            {t("add.window")}
          </button>
        </div>

        <div className="category-section">
          <div className="category-header">
            <span>{t("cat.flooring")}</span>
            <span className="rule" />
          </div>
          {room.flooring_sections.map((item, i) => (
            <FlooringSectionForm
              key={i}
              item={item}
              onChange={(updated) => onChange({ ...room, flooring_sections: replaceAt(room.flooring_sections, i, updated) })}
              onRemove={() => onChange({ ...room, flooring_sections: removeAt(room.flooring_sections, i) })}
            />
          ))}
          <button
            type="button"
            className="add-item-button"
            onClick={() => onChange({ ...room, flooring_sections: [...room.flooring_sections, emptyFlooringSection()] })}
          >
            {t("add.flooring")}
          </button>
        </div>

        <div className="category-section">
          <div className="category-header">
            <span>{t("cat.insect")}</span>
            <span className="rule" />
          </div>
          {room.insect_screens.map((item, i) => (
            <InsectScreenForm
              key={i}
              item={item}
              onChange={(updated) => onChange({ ...room, insect_screens: replaceAt(room.insect_screens, i, updated) })}
              onRemove={() => onChange({ ...room, insect_screens: removeAt(room.insect_screens, i) })}
            />
          ))}
          <button
            type="button"
            className="add-item-button"
            onClick={() => onChange({ ...room, insect_screens: [...room.insect_screens, emptyInsectScreen()] })}
          >
            {t("add.insect")}
          </button>
        </div>

        <div className="category-section">
          <div className="category-header">
            <span>{t("cat.sun")}</span>
            <span className="rule" />
          </div>
          {room.sun_shadings.map((item, i) => (
            <SunShadingForm
              key={i}
              item={item}
              onChange={(updated) => onChange({ ...room, sun_shadings: replaceAt(room.sun_shadings, i, updated) })}
              onRemove={() => onChange({ ...room, sun_shadings: removeAt(room.sun_shadings, i) })}
            />
          ))}
          <button
            type="button"
            className="add-item-button"
            onClick={() => onChange({ ...room, sun_shadings: [...room.sun_shadings, emptySunShading()] })}
          >
            {t("add.sun")}
          </button>
        </div>
      </div>
    </section>
  );
}
