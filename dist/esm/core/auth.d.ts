export declare const API_KEY_ENV = "YM_API_KEY";
export interface YmAuth {
    apiKey: string;
    /** OAuth-токен: нужен части методов (`x-auth-scopes`), обычно не требуется. */
    oauthToken?: string;
}
export interface YmAuthConfig {
    apiKey?: string;
    oauthToken?: string;
}
/** Ключ из конфига или окружения; без ключа — понятная ошибка до сети. */
export declare function resolveAuth(config?: YmAuthConfig, env?: Record<string, string | undefined>): YmAuth;
/** Заголовки авторизации для каждого запроса. */
export declare function authHeaders(auth: YmAuth): Record<string, string>;
