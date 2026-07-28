/** Inject JSON-LD structured data for search engines. */
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON in the document for crawlers.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
