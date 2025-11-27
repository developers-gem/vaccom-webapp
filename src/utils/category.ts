export function decodeCategorySlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\band\b/g, "&")   // convert "and" → "&"
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
}
