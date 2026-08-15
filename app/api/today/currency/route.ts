import { NextResponse } from "next/server";

export const revalidate = 21600;

type CurrencyCode = "USD" | "EUR" | "TRY" | "IRR" | "GBP" | "AED" | "CAD";
type Rates = Partial<Record<CurrencyCode, Partial<Record<CurrencyCode, number>>>>;

const CURRENCIES: CurrencyCode[] = ["USD", "EUR", "TRY", "GBP", "AED", "CAD", "IRR"];
const OANOR_URL = "https://api.oanor.com/irr-api/v1/currencies";

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function findCurrencyRecord(data: unknown, code: CurrencyCode): unknown {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const nestedCurrencies = (record.data as { currencies?: unknown } | undefined)?.currencies;
  if (Array.isArray(nestedCurrencies)) {
    const match = nestedCurrencies.find((item) => {
      if (!item || typeof item !== "object") return false;
      const symbol = String((item as Record<string, unknown>).symbol ?? "").toUpperCase();
      return symbol === code;
    });
    if (match) {
      return match;
    }
  }

  const direct = record[code] ?? record[code.toLowerCase()];
  if (direct) {
    return direct;
  }

  for (const value of Object.values(record)) {
    if (!value || typeof value !== "object") {
      continue;
    }
    const candidate = value as Record<string, unknown>;
    const symbol = String(candidate.symbol ?? candidate.code ?? candidate.currency ?? "").toUpperCase();
    if (symbol === code) {
      return candidate;
    }
  }

  return null;
}

function extractIrrRate(data: unknown, code: CurrencyCode): number | null {
  if (code === "IRR") {
    return 1;
  }

  const record = findCurrencyRecord(data, code);
  if (!record || typeof record !== "object") {
    return null;
  }

  const item = record as Record<string, unknown>;
  const directCandidates = [
    item.irr,
    item.rial,
    item.price_irr,
    item.priceIrr,
    item.close_irr,
    item.closeIrr,
    item.sell_irr,
    item.sellIrr,
  ];

  for (const candidate of directCandidates) {
    const value = readNumber(candidate);
    if (value) {
      return value;
    }
  }

  const tomanCandidates = [
    item.toman,
    item.price_toman,
    item.priceToman,
    item.close_toman,
    item.closeToman,
    item.sell,
    item.close,
    item.price,
    item.value,
  ];

  for (const candidate of tomanCandidates) {
    const value = readNumber(candidate);
    if (value) {
      return value * 10;
    }
  }

  return null;
}

function normalizeRates(data: unknown) {
  const oneUnitToIrr = new Map<CurrencyCode, number>();

  for (const currency of CURRENCIES) {
    const value = extractIrrRate(data, currency);
    if (value) {
      oneUnitToIrr.set(currency, value);
    }
  }

  const rates: Rates = {};
  for (const from of CURRENCIES) {
    rates[from] = {};
    for (const to of CURRENCIES) {
      const fromIrr = oneUnitToIrr.get(from);
      const toIrr = oneUnitToIrr.get(to);
      if (from === to) {
        rates[from]![to] = 1;
      } else if (fromIrr && toIrr) {
        rates[from]![to] = fromIrr / toIrr;
      }
    }
  }

  return rates;
}

function findUpdatedAt(data: unknown) {
  if (!data || typeof data !== "object") {
    return new Date().toISOString();
  }

  const record = data as Record<string, unknown>;
  const meta = record.meta as Record<string, unknown> | undefined;
  const nestedData = record.data as { currencies?: unknown } | undefined;
  const firstCurrency = Array.isArray(nestedData?.currencies)
    ? (nestedData.currencies[0] as Record<string, unknown> | undefined)
    : undefined;
  const candidate =
    meta?.timestamp ??
    record.updated_at ??
    record.updatedAt ??
    record.date ??
    record.time ??
    record.timestamp ??
    record.result_updated_at ??
    firstCurrency?.date;

  return typeof candidate === "string" || typeof candidate === "number"
    ? String(candidate)
    : new Date().toISOString();
}

export async function GET() {
  const apiKey = process.env.OANOR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Missing OANOR_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(OANOR_URL, {
      headers: {
        "x-oanor-key": apiKey,
        Accept: "application/json",
      },
      next: {
        revalidate,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "Currency provider failed" },
        { status: 502 }
      );
    }

    const data = (await response.json()) as unknown;
    const rates = normalizeRates(data);

    return NextResponse.json({
      ok: true,
      provider: "Oanor Iran Rial Market API",
      updatedAt: findUpdatedAt(data),
      cachedForSeconds: revalidate,
      rates,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Currency request failed" },
      { status: 502 }
    );
  }
}
