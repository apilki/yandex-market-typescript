"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YmApiError = void 0;
exports.toYmError = toYmError;
exports.ymErrorFromResponse = ymErrorFromResponse;
/**
 * Ошибки Яндекс Маркета: конверт `{ errors: [ { code, message } ] }`.
 *
 * Общий класс, редактирование секретов и статусные формулировки — из
 * `@apilki/core`; здесь только выбор полей вендорского конверта. У ошибок
 * Маркета несколько причин в одном ответе (`errors[]`), поэтому список
 * сохраняется целиком: потребителю нужен код, а не только текст.
 */
const errors_ts_1 = require("./shared/errors.js");
class YmApiError extends errors_ts_1.ApiError {
    constructor(init) {
        var _a, _b, _c, _d, _e, _f, _g;
        const first = (_a = init.errors) === null || _a === void 0 ? void 0 : _a[0];
        const rest = (_c = (_b = init.errors) === null || _b === void 0 ? void 0 : _b.slice(1).map((e) => { var _a; return (_a = e.message) !== null && _a !== void 0 ? _a : e.code; }).filter(Boolean).join('; ')) !== null && _c !== void 0 ? _c : null;
        super({
            status: init.status,
            code: (_d = first === null || first === void 0 ? void 0 : first.code) !== null && _d !== void 0 ? _d : null,
            detail: (_f = (_e = first === null || first === void 0 ? void 0 : first.message) !== null && _e !== void 0 ? _e : first === null || first === void 0 ? void 0 : first.code) !== null && _f !== void 0 ? _f : null,
            hint: rest,
            retryAfterSeconds: init.retryAfterSeconds,
            body: init.body,
        });
        this.name = 'YmApiError';
        this.errors = (_g = init.errors) !== null && _g !== void 0 ? _g : [];
    }
}
exports.YmApiError = YmApiError;
const asRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value
    : undefined;
const asText = (value) => typeof value === 'string' && value.trim() ? value.trim() : undefined;
function parseErrors(value) {
    if (!Array.isArray(value))
        return [];
    return value
        .map((item) => asRecord(item))
        .filter((item) => item !== undefined)
        .map((item) => {
        const parsed = {};
        const code = asText(item['code']);
        const message = asText(item['message']);
        if (code !== undefined)
            parsed.code = code;
        if (message !== undefined)
            parsed.message = message;
        return parsed;
    });
}
/** Тело ответа + статус → `YmApiError`. */
function toYmError(status, body, options = {}) {
    const record = asRecord(body);
    if (record) {
        return new YmApiError({
            status,
            errors: parseErrors(record['errors']),
            retryAfterSeconds: options.retryAfterSeconds,
            body,
        });
    }
    const text = asText(typeof body === 'string' ? body : undefined);
    const usable = text !== undefined && text.length <= 200 && !text.startsWith('<') ? (0, errors_ts_1.redact)(text) : null;
    return new YmApiError(Object.assign(Object.assign({ status, errors: usable ? [{ message: usable }] : [] }, options), { body }));
}
/** Неуспешный ответ → `YmApiError`. Тело читается из клона. */
function ymErrorFromResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = yield response.clone().text().catch(() => '');
        const header = response.headers.get('retry-after');
        const seconds = header === null || header.trim() === '' ? NaN : Number(header);
        return toYmError(response.status, (0, errors_ts_1.parseBody)(text), {
            retryAfterSeconds: Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined,
        });
    });
}
