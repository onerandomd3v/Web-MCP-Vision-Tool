import { describe, expect, it, beforeEach } from "vitest";
import {
  ACCEPTED_USER_PHOTO_TYPES,
  MAX_USER_PHOTO_BYTES,
  getUserPhotoUrl,
  setUserPhotoUrl,
  validateUserPhoto,
} from "../vision/userPhoto";

describe("user photo contract", () => {
  beforeEach(() => setUserPhotoUrl(null));

  it("accepts the supported image types under the size limit", () => {
    for (const type of ACCEPTED_USER_PHOTO_TYPES) {
      expect(validateUserPhoto({ type, size: MAX_USER_PHOTO_BYTES })).toBeNull();
    }
  });

  it("rejects unsupported types and oversized files", () => {
    expect(validateUserPhoto({ type: "image/gif", size: 100 })).toMatch(/JPG/);
    expect(validateUserPhoto({ type: "image/jpeg", size: MAX_USER_PHOTO_BYTES + 1 })).toMatch(/8 MB/);
  });

  it("stores and clears the current session photo URL", () => {
    setUserPhotoUrl("blob:photo");
    expect(getUserPhotoUrl()).toBe("blob:photo");
    setUserPhotoUrl(null);
    expect(getUserPhotoUrl()).toBeNull();
  });
});
