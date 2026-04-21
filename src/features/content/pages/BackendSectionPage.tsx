import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

type BackendSectionPageProps = {
  title: string;
  endpoint: string;
};

export function BackendSectionPage({ title, endpoint }: BackendSectionPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    // strip a hard‑coded "/api/v1" prefix if someone accidentally passed it
    // in via the route defaults or environment variable.  buildApiUrl already
    // handles full URLs (http://...) so this only affects relative paths.
    const normalizedEndpoint = endpoint.replace(/^\/api\/v1/, "");

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(buildApiUrl(normalizedEndpoint));
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }
        const data = await response.json();
        if (!cancelled) {
          setPayload(data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load data";
        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Source endpoint: <code>{buildApiUrl(endpoint.replace(/^\/api\/v1/, ""))}</code>
      </p>

      {loading && <p>Loading...</p>}
      {!loading && error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Could not load {title.toLowerCase()}.</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <pre className="rounded-md bg-slate-950 text-slate-100 p-4 overflow-auto text-sm">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </section>
  );
}

