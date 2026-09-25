const PLACEHOLDER_PATTERN = /Car[_%20]icon|Car%20icon/i;

/** Real gallery URLs only — strips Wikimedia placeholder icons. */
export function getCarGallery(images: string[] | undefined): string[] {
  if (!images?.length) return [];
  return images.filter((url) => url && !PLACEHOLDER_PATTERN.test(url));
}

export function getCarCoverImage(images: string[] | undefined, fallback = "/next.svg"): string {
  return getCarGallery(images)[0] || fallback;
}
