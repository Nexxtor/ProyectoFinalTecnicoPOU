export function normalizeAssetPath(path) {
  if (!path) return path;
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  return path.replace(/^\/+/, '');
}

export function assetUrl(path) {
  if (!path) return path;
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${normalizeAssetPath(path)}`;
}
