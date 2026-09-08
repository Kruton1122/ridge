import { createFileRoute } from "@tanstack/react-router";
import { ledgerCsv } from "@/lib/data/ledger";

export const Route = createFileRoute("/api/ledger.csv")({
  server: {
    handlers: {
      GET: async () =>
        new Response(ledgerCsv(), {
          headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": "inline; filename=ridge-ledger.csv",
          },
        }),
    },
  },
});
