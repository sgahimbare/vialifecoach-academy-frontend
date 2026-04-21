export function extractApiErrorMessage(raw: unknown, fallback = "Request failed") {
  if (!raw) return fallback;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return (
        (typeof parsed.message === "string" && parsed.message) ||
        (typeof parsed.error === "string" && parsed.error) ||
        fallback
      );
    } catch {
      return raw;
    }
  }
  if (raw instanceof Error) {
    return extractApiErrorMessage(raw.message, fallback);
  }
  if (typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
  }
  return fallback;
}
