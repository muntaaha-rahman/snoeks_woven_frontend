import type { ChangeEvent } from "react";
import { fileUrl } from "../api/client";
import type { Photo } from "../api/types";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  savedPhotos: Photo[];
  stagedPhotos: string[];
  onStagedPhotosChange: (photos: string[]) => void;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PhotoPicker({ savedPhotos, stagedPhotos, onStagedPhotosChange }: Props) {
  const { t } = useI18n();
  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    onStagedPhotosChange([...stagedPhotos, ...dataUrls]);
    e.target.value = "";
  }

  function removeStaged(index: number) {
    onStagedPhotosChange(stagedPhotos.filter((_, i) => i !== index));
  }

  return (
    <div className="photo-picker">
      <div className="photo-thumbs">
        {savedPhotos.map((photo) => (
          <img key={photo.id} src={fileUrl(photo.file_path)} alt={t("photo.alt")} className="photo-thumb" />
        ))}
        {stagedPhotos.map((dataUrl, i) => (
          <div key={i} className="photo-thumb photo-thumb-staged">
            <img src={dataUrl} alt={t("photo.pending")} />
            <button type="button" onClick={() => removeStaged(i)} aria-label={t("photo.remove")}>
              &times;
            </button>
          </div>
        ))}
      </div>
      <label className="photo-add-button">
        {t("photo.add")}
        <input type="file" accept="image/*" capture="environment" multiple hidden onChange={handleFiles} />
      </label>
    </div>
  );
}
