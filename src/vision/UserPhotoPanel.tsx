import { useEffect, useRef, useState } from "react";
import { getUserPhotoUrl, setUserPhotoUrl, validateUserPhoto } from "./userPhoto";

export function UserPhotoPanel() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(getUserPhotoUrl());
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (photoUrl?.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  function onFileChange(file: File | undefined) {
    if (!file) return;
    const validationError = validateUserPhoto(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (photoUrl?.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
    const nextUrl = URL.createObjectURL(file);
    setPhotoUrl(nextUrl);
    setUserPhotoUrl(nextUrl);
    setError(null);
  }

  function removePhoto() {
    if (photoUrl?.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setUserPhotoUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section className="mb-8 rounded-2xl border border-stone-200 bg-stone-50 p-5" aria-labelledby="photo-match-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="photo-match-heading" className="text-lg font-semibold text-stone-900">Shop by how it looks</h2>
          <p className="mt-1 max-w-2xl text-sm text-stone-500">Upload a photo of your space to give a multimodal assistant visual context. Your image stays in this browser session until you remove it.</p>
        </div>
        <label className="cursor-pointer rounded-lg bg-stone-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-stone-700">
          {photoUrl ? "Replace photo" : "Choose a photo"}
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => onFileChange(event.target.files?.[0])} />
        </label>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      {photoUrl && (
        <div className="mt-4 flex items-center gap-4">
          <img src={photoUrl} alt="Your uploaded space" className="h-24 w-24 rounded-xl object-cover" />
          <button type="button" onClick={removePhoto} className="text-sm font-medium text-stone-600 underline hover:text-stone-900">Remove photo</button>
        </div>
      )}
    </section>
  );
}
