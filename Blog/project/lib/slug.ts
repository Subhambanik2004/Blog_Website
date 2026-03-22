export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'post';
}

export function uniqueSlugFromTitle(title: string): string {
  return `${slugify(title)}-${Date.now().toString(36)}`;
}
