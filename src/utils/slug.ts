// src/utils/slug.ts
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")         // ⭐ Convert '&' to 'and'
    .replace(/[^a-z0-9\s-]/g, "")   // Remove all other special chars
    .replace(/\s+/g, "-")           // Spaces → dashes
    .replace(/-+/g, "-")            // Collapse multiple dashes
    .replace(/^-|-$/g, "");         // Trim dashes
}


