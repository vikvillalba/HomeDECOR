import type { CreateQuoteInput } from "../types/quote.types";

const MAX_SEARCH_TOKENS = 300;
const MIN_SEARCH_TOKEN_LENGTH = 2;
const MAX_PHRASE_WORDS = 4;

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function addToken(tokens: Set<string>, token: string) {
  if (tokens.size >= MAX_SEARCH_TOKENS) return false;
  if (token.length < MIN_SEARCH_TOKEN_LENGTH) return true;

  tokens.add(token);

  return tokens.size < MAX_SEARCH_TOKENS;
}

function addPrefixes(tokens: Set<string>, value: string) {
  for (
    let length = MIN_SEARCH_TOKEN_LENGTH;
    length <= value.length;
    length += 1
  ) {
    if (!addToken(tokens, value.slice(0, length))) return;
  }
}

function addTextTokens(tokens: Set<string>, value: string) {
  const normalizedValue = normalizeSearchText(value);
  if (!normalizedValue) return;

  const words = normalizedValue.split(" ");

  for (const word of words) {
    addPrefixes(tokens, word);
    if (tokens.size >= MAX_SEARCH_TOKENS) return;
  }

  for (let startIndex = 0; startIndex < words.length; startIndex += 1) {
    const phraseWords = words.slice(
      startIndex,
      startIndex + MAX_PHRASE_WORDS
    );

    addPrefixes(tokens, phraseWords.join(" "));
    if (tokens.size >= MAX_SEARCH_TOKENS) return;
  }
}

function addNumericTokens(tokens: Set<string>, value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length >= MIN_SEARCH_TOKEN_LENGTH) {
    addPrefixes(tokens, digitsOnly);
  }
}

export function buildQuoteSearchTokens(input: CreateQuoteInput): string[] {
  const tokens = new Set<string>();
  const values = [
    input.clientName,
    input.clientPhone,
  ];

  for (const value of values) {
    addTextTokens(tokens, value);
    addNumericTokens(tokens, value);

    if (tokens.size >= MAX_SEARCH_TOKENS) break;
  }

  return Array.from(tokens).slice(0, MAX_SEARCH_TOKENS);
}
