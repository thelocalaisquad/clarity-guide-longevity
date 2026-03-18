const URL_REGEX = /^https?:\/\/.+/i;

export function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // empty is ok (optional)
  try {
    new URL(url);
    return URL_REGEX.test(url);
  } catch {
    return false;
  }
}

export function validateUrls(fields: Record<string, string>): string[] {
  const errors: string[] = [];
  for (const [label, url] of Object.entries(fields)) {
    if (url && !isValidUrl(url)) {
      errors.push(`${label} must be a valid URL starting with http(s)://`);
    }
  }
  return errors;
}
