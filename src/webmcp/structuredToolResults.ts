/** Keep routine commerce tool results textual; visual tools opt in to images. */
export function withoutImageUrl<T extends Record<string, unknown>>(value: T): Omit<T, "imageUrl"> {
  const { imageUrl: _imageUrl, ...rest } = value;
  return rest;
}

export function withoutImageUrls<T extends Record<string, unknown>>(values: T[]): Array<Omit<T, "imageUrl">> {
  return values.map((value) => withoutImageUrl(value));
}
