/**
 * Авторизация Яндекс Маркета: `Api-Key` (и опционально OAuth `Bearer`).
 *
 * Правило «конфиг важнее окружения, пробелы срезаем» — общее, из
 * `@apilki/core`; вендорское здесь только имя заголовка и переменная окружения.
 */
import { resolveToken } from "./shared/auth.js";
export const API_KEY_ENV = 'YM_API_KEY';
function envOrEmpty() {
    var _a, _b;
    return (_b = (_a = globalThis.process) === null || _a === void 0 ? void 0 : _a.env) !== null && _b !== void 0 ? _b : {};
}
/** Ключ из конфига или окружения; без ключа — понятная ошибка до сети. */
export function resolveAuth(config = {}, env = envOrEmpty()) {
    const apiKey = resolveToken({ token: config.apiKey }, env, API_KEY_ENV);
    if (!apiKey)
        throw new Error(`нет ключа Яндекс Маркета: передайте apiKey или переменную ${API_KEY_ENV}`);
    const oauthToken = typeof config.oauthToken === 'string' ? config.oauthToken.trim() : '';
    return oauthToken ? { apiKey, oauthToken } : { apiKey };
}
/** Заголовки авторизации для каждого запроса. */
export function authHeaders(auth) {
    return auth.oauthToken
        ? { 'Api-Key': auth.apiKey, Authorization: `Bearer ${auth.oauthToken}` }
        : { 'Api-Key': auth.apiKey };
}
