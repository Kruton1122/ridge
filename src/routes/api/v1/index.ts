import { createFileRoute } from "@tanstack/react-router";
import { BENCHMARKS, MODELS, NEWS, SCHEMA_VERSION, SCORES, SNAPSHOT_DATE } from "@/lib/data/catalog";

export const Route = createFileRoute("/api/v1/")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          schemaVersion: SCHEMA_VERSION,
          generatedOn: SNAPSHOT_DATE,
          citation: `Ridge (${SNAPSHOT_DATE}). Frontier model benchmark ledger.`,
          models: MODELS,
          benchmarks: BENCHMARKS,
          scores: SCORES,
          news: NEWS,
        }),
    },
  },
});
