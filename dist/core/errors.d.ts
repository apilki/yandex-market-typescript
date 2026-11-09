/**
 * Ошибки Яндекс Маркета: конверт `{ errors: [ { code, message } ] }`.
 *
 * Общий класс, редактирование секретов и статусные формулировки — из
 * `@apilki/core`; здесь только выбор полей вендорского конверта. У ошибок
 * Маркета несколько причин в одном ответе (`errors[]`), поэтому список
 * сохраняется целиком: потребителю нужен код, а не только текст.
 */
import { ApiError } from './shared/errors.ts';
export interface YmErrorItem {
    code?: string;
    message?: string;
}
export interface YmErrorInit {
    status: number;
    errors?: YmErrorItem[];
    retryAfterSeconds?: number | null;
    body?: unknown;
}
export declare class YmApiError extends ApiError {
    /** Все причины из `errors[]` — как есть, для программной обработки. */
    readonly errors: YmErrorItem[];
    constructor(init: YmErrorInit);
}
/** Тело ответа + статус → `YmApiError`. */
export declare function toYmError(status: number, body: unknown, options?: {
    retryAfterSeconds?: number;
}): YmApiError;
/** Неуспешный ответ → `YmApiError`. Тело читается из клона. */
export declare function ymErrorFromResponse(response: Response): Promise<YmApiError>;
