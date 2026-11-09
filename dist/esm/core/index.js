/**
 * Рукописное ядро клиента @apilki/yandex-market.
 *
 * Четыре модуля: `auth`, `http`, `errors`,
 * `rate-limit`. Ядро не зависит от сгенерированного кода: `typecheck` проходит
 * на чистом клоне. Сшивка «ядро + API-классы» — `wiring.ts`.
 */
export const CORE_VERSION = '0.1.0';
export { API_KEY_ENV, authHeaders, resolveAuth } from "./auth.js";
export { YmApiError, toYmError, ymErrorFromResponse } from "./errors.js";
export { CLIENT_ERROR_COST, DEFAULT_PAUSE_MS, RateLimiter } from "./shared/rate-limit.js";
export { DEFAULT_RETRY, DEFAULT_TIMEOUT_MS, createHttpFetch } from "./shared/http.js";
export { ApiError, redact } from "./shared/errors.js";
export { configure } from "./wiring.js";
/** Общая часть ядра (@apilki/core), вендорено в `shared/`. */
export * as shared from "./shared/index.js";
