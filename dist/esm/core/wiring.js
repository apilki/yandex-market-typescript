/**
 * Сшивка ядра со сгенерированным кодом Яндекс Маркета.
 *
 * Один вызов `configure(items.Configuration)` на раздел: ключ в заголовке
 * `Api-Key`, общий транспорт (таймаут, отмена, ретраи 429/5xx по `Retry-After`)
 * и общий лимитер. Маркет отдаёт лимиты в `X-Ratelimit-*` не на всех методах,
 * поэтому при их отсутствии работает дефолтная пауза, а не «без ограничений».
 */
import { authHeaders, resolveAuth } from "./auth.js";
import { RateLimiter } from "./shared/rate-limit.js";
import { createHttpFetch } from "./shared/http.js";
export function configure(Ctor, options = {}) {
    var _a, _b, _c, _d;
    const auth = resolveAuth(options, options.env);
    const limiter = (_a = options.limiter) !== null && _a !== void 0 ? _a : new RateLimiter(options.now ? { now: options.now } : {});
    const probe = new Ctor({});
    const basePath = (_b = options.basePath) !== null && _b !== void 0 ? _b : probe.basePath;
    const transport = createHttpFetch(Object.assign(Object.assign(Object.assign(Object.assign({ fetch: (_c = options.fetchApi) !== null && _c !== void 0 ? _c : ((url, init) => fetch(url, init)), limiter, host: new URL(basePath).host }, (options.timeoutMs ? { timeoutMs: options.timeoutMs } : {})), (options.retry ? { retry: options.retry } : {})), (options.sleep ? { sleep: options.sleep } : {})), (options.now ? { now: options.now } : {})));
    const config = new Ctor({ basePath, headers: authHeaders(auth), fetchApi: transport.fetch });
    if (((_d = config.headers) === null || _d === void 0 ? void 0 : _d['Api-Key']) !== auth.apiKey) {
        throw new Error('Configuration не принял заголовок Api-Key — у схемы раздела другое поле');
    }
    return { config, limiter };
}
