"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_KEY_ENV = void 0;
exports.resolveAuth = resolveAuth;
exports.authHeaders = authHeaders;
/**
 * Авторизация Яндекс Маркета: `Api-Key` (и опционально OAuth `Bearer`).
 *
 * Правило «конфиг важнее окружения, пробелы срезаем» — общее, из
 * `@apilki/core`; вендорское здесь только имя заголовка и переменная окружения.
 */
const auth_ts_1 = require("./shared/auth.js");
exports.API_KEY_ENV = 'YM_API_KEY';
function envOrEmpty() {
    var _a, _b;
    return (_b = (_a = globalThis.process) === null || _a === void 0 ? void 0 : _a.env) !== null && _b !== void 0 ? _b : {};
}
/** Ключ из конфига или окружения; без ключа — понятная ошибка до сети. */
function resolveAuth(config = {}, env = envOrEmpty()) {
    const apiKey = (0, auth_ts_1.resolveToken)({ token: config.apiKey }, env, exports.API_KEY_ENV);
    if (!apiKey)
        throw new Error(`нет ключа Яндекс Маркета: передайте apiKey или переменную ${exports.API_KEY_ENV}`);
    const oauthToken = typeof config.oauthToken === 'string' ? config.oauthToken.trim() : '';
    return oauthToken ? { apiKey, oauthToken } : { apiKey };
}
/** Заголовки авторизации для каждого запроса. */
function authHeaders(auth) {
    return auth.oauthToken
        ? { 'Api-Key': auth.apiKey, Authorization: `Bearer ${auth.oauthToken}` }
        : { 'Api-Key': auth.apiKey };
}
