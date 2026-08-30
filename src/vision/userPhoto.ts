let currentUserPhotoUrl: string | null = null;

export function setUserPhotoUrl(url: string | null) {
  currentUserPhotoUrl = url;
}

export function getUserPhotoUrl() {
  return currentUserPhotoUrl;
}

export const MAX_USER_PHOTO_BYTES = 8 * 1024 * 1024;
export const ACCEPTED_USER_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function validateUserPhoto(file: Pick<File, "type" | "size">) {
  if (!ACCEPTED_USER_PHOTO_TYPES.includes(file.type as (typeof ACCEPTED_USER_PHOTO_TYPES)[number])) {
    return "Choose a JPG, PNG, or WebP image.";
  }
  if (file.size > MAX_USER_PHOTO_BYTES) {
    return "Choose an image smaller than 8 MB.";
  }
  return null;
}
