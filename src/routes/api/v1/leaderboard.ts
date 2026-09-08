import { createFileRoute } from "@tanstack/react-router";
import { MODELS, SCHEMA_VERSION, SCORES, SNAPSHOT_DATE, getModel, rankBenchmark } from "@/lib/data/catalog";

export const Route = createFileRoute("/api/v1/leaderboard")({
  server: {
    handlers: {
      GET: async () => {
        const ranked = rankBenchmark("aa-intelligence", SCORES);
        return Response.json({
          schemaVersion: SCHEMA_VERSION,
          generatedOn: SNAPSHOT_DATE,
          rows: ranked.map((row, i) => {
            const model = getModel(row.modelId, MODELS);
            return {
              rank: i + 1,
              id: row.modelId,
              name: model?.name,
              lab: model?.labName,
              score: row.value,
              note: row.note,
            };
          }),
        });
      },
    },
  },
});
