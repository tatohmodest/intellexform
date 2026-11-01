CREATE TABLE IF NOT EXISTS app_documents (
  collection TEXT NOT NULL,
  id TEXT NOT NULL,
  payload JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT app_documents_pkey PRIMARY KEY (collection, id)
);

CREATE INDEX IF NOT EXISTS app_documents_collection_updated_at_idx
  ON app_documents (collection, "updatedAt");
