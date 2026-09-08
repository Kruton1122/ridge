import { createFileRoute } from "@tanstack/react-router";
import { ledgerPayload } from "@/lib/data/ledger";

export const Route = createFileRoute("/api/ledger")({
  server: {
    handlers: {
      GET: async () => Response.json(ledgerPayload()),
    },
  },
});
