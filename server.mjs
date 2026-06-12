#!/usr/bin/env node
// K-Data Gate MCP server — Korean market data tools for AI agents.
// Docs: https://kdata-gate.vercel.app/docs | Free pilot key: POST /api/keys
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const baseUrl = process.env.KDATA_BASE_URL ?? 'https://kdata-gate.vercel.app';
const apiKey = process.env.KDATA_API_KEY;

const tools = [
  ['search_korean_products', '/api/v1/products', 'Search Korean products including K-beauty, K-food, and K-pop merch categories. English JSON.', { q: z.string().optional(), category: z.string().optional(), source: z.string().optional() }],
  ['get_korea_trends', '/api/v1/trends', 'Get Korean (Naver) search trend indices for a keyword — viral detection for K-beauty/K-food.', { keyword: z.string().optional(), category: z.string().optional(), period: z.string().optional() }],
  ['get_korea_real_estate', '/api/v1/realestate', 'Get Korean apartment transaction records (MOLIT) in English.', { region: z.string().optional(), yyyymm: z.string().optional() }],
  ['get_korean_company_filings', '/api/v1/companies', 'Get Korean company profiles and filings (DART) in English.', { corp: z.string().optional(), report: z.string().optional(), year: z.string().optional() }],
  ['get_korean_stock_overview', '/api/v1/stocks', 'Get Korean stock market overview rows.', { ticker: z.string().optional(), market: z.string().optional(), sector: z.string().optional() }],
  ['get_korean_stock_prices', '/api/v1/stocks/prices', 'Get Korean stock OHLCV and traded value.', { ticker: z.string().optional(), market: z.string().optional(), date_from: z.string().optional(), date_to: z.string().optional(), adjusted: z.string().optional() }],
  ['get_korean_stock_fundamentals', '/api/v1/stocks/fundamentals', 'Get Korean stock fundamentals and valuation ratios.', { ticker: z.string().optional(), corp: z.string().optional(), year: z.string().optional(), quarter: z.string().optional(), metric: z.string().optional() }],
  ['get_korean_stock_disclosures', '/api/v1/stocks/disclosures', 'Get Korean DART equity disclosures summarized in English.', { ticker: z.string().optional(), corp: z.string().optional(), report: z.string().optional(), date_from: z.string().optional(), date_to: z.string().optional() }],
  ['get_korean_stock_flows', '/api/v1/stocks/flows', 'Get Korean investor flow, program trading, short, and lending data.', { ticker: z.string().optional(), market: z.string().optional(), investor: z.string().optional(), date_from: z.string().optional(), date_to: z.string().optional() }],
  ['get_korean_stock_screeners', '/api/v1/stocks/screeners', 'Get derived Korean equity screening signals.', { preset: z.string().optional(), market: z.string().optional(), sector: z.string().optional(), min_volume: z.string().optional() }],
  ['get_korea_fx_macro', '/api/v1/fx-macro', 'Get Korea FX rates and macro indicators.', { indicator: z.string().optional(), period: z.string().optional() }],
  ['get_korea_tourism', '/api/v1/tourism', 'Get Korean tourism places and attractions in English.', { area: z.string().optional(), type: z.string().optional(), lang: z.string().optional() }],
  ['get_korea_weather', '/api/v1/weather', 'Get Korean weather conditions and forecasts.', { city: z.string().optional(), type: z.string().optional() }]
];

async function call(endpoint, args) {
  const url = new URL(endpoint, baseUrl);
  for (const [k, v] of Object.entries(args)) if (v !== undefined) url.searchParams.set(k, String(v));
  if (!apiKey) url.searchParams.set('preview', 'true');
  const res = await fetch(url, { headers: apiKey ? { Authorization: 'Bearer ' + apiKey } : {} });
  return { status: res.status, body: await res.json() };
}

const server = new McpServer({ name: 'kdata-gate', version: '0.1.0' });
for (const [name, endpoint, description, schema] of tools) {
  server.tool(name, description, schema, async (args) => ({ content: [{ type: 'text', text: JSON.stringify(await call(endpoint, args), null, 2) }] }));
}
await server.connect(new StdioServerTransport());
