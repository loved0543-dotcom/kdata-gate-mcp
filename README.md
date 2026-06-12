# K-Data Gate MCP Server

Korean market data for AI agents — in English JSON. 13 tools covering:

- **Products** — search Korean products incl. K-beauty, K-food, K-pop merch (`search_korean_products`)
- **Trends** — Naver search trend indices, viral detection for keywords like `buldak` or `sunscreen` (`get_korea_trends`)
- **Stocks** — prices, fundamentals, DART disclosures, investor flows, screeners (5 tools)
- **Real estate** — apartment transactions from MOLIT (`get_korea_real_estate`)
- **Companies, FX/macro, tourism, weather**

Backed by the [K-Data Gate API](https://kdata-gate.vercel.app) ([docs](https://kdata-gate.vercel.app/docs), [OpenAPI](https://kdata-gate.vercel.app/openapi.json), [llms.txt](https://kdata-gate.vercel.app/llms.txt)).

## Quick start

No API key: tools run in preview mode (3 sample rows per call).

```json
{
  "mcpServers": {
    "kdata-gate": {
      "command": "npx",
      "args": ["-y", "github:loved0543-dotcom/kdata-gate-mcp"]
    }
  }
}
```

## Free pilot key (full responses, 100 calls/month)

```bash
curl -X POST https://kdata-gate.vercel.app/api/keys \
  -H "content-type: application/json" \
  -d '{"email":"you@example.com","plan":"free"}'
```

Then add the key to your config:

```json
{
  "mcpServers": {
    "kdata-gate": {
      "command": "npx",
      "args": ["-y", "github:loved0543-dotcom/kdata-gate-mcp"],
      "env": { "KDATA_API_KEY": "kg_pilot_..." }
    }
  }
}
```

## Who is this for

- Agents helping e-commerce sellers source from Korea (what's trending, local prices, new releases, compliance)
- Agents answering K-beauty / K-food questions
- Agents researching Korean equities (English DART summaries)
- Agents planning Korea travel

## Status

Free pilot. Responses currently serve deterministic curated fixtures while live provider connections are finalized — each response's `meta.mode` field says `fixture` or `live`. No payment is required during the pilot.

## License

MIT
