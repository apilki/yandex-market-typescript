# @apilki/yandex-market — JavaScript/TypeScript client

**Version: 0.6.0 · API as of 2026-11-22** <!-- штампуется пайплайном (github-distro); штамп ОДИН (EN), стандарт public-client-readme-standard -->

A **curated generated TypeScript client** for the Yandex Market Partner API —
generated from the official API specification, with edge-cases and conflicts
resolved. Fully typed, fetch-based, zero runtime dependencies, works in
Node.js ≥ 18 and browsers. Covers all 161 operations (43 API classes) and is
regenerated on every upstream change.

```bash
npm install @apilki/yandex-market
```

Docs: https://yandex.ru/dev/market/partner-api/doc/ru/ · Full description (RU) below.

## Что это

Готовый TypeScript-клиент для **Yandex Market Partner API** — заказы, каталог,
цены, отчёты (продавец-сторона). Сгенерирован из официальной документации
Яндекса и **доведён до ума**: неоднозначности и конфликты документации
разбираются агентами и автоматическими рецептами, результат проверяется
тестами — вы получаете клиент, который просто работает.

- **Полное покрытие** — все 161 операция, 43 API-класса, ~757 моделей;
- **Всегда свежий** — перегенерируется при каждом изменении API Яндекса;
- **Никаких зависимостей** — на чистом `fetch`, работает в Node.js ≥ 18 и в браузере;
- **Типизация / Ноль сюрпризов** — полные `.d.ts`, оригинальные имена полей из спецификации.

## Установка

```bash
npm install @apilki/yandex-market
```

## Быстрый старт

### 1. Инициализация клиента

Авторизация настраивается один раз через `Configuration`. Ключ передается в заголовке `Api-Key`.

```javascript
import { Configuration, OrderApi, CampaignsApi } from '@apilki/yandex-market';

const config = new Configuration({
    basePath: 'https://api.partner.market.yandex.ru',
    headers: {
        'Api-Key': 'ACMA:YOUR_SECRET_KEY',
        'Content-Type': 'application/json'
    }
});

const orderApi = new OrderApi(config);
const campaignsApi = new CampaignsApi(config);
```

### 2. Несколько кабинетов или магазинов

В зависимости от метода API Яндекса первым аргументом выступает либо
**campaignId** (идентификатор магазина), либо **businessId** (идентификатор
бизнеса/кабинета). Ключ авторизации `Api-Key` уже в заголовках конфигурации —
в аргументах он не требуется.

```javascript
const campaignId = 12345678;
const businessId = 987654;

async function fetchData() {
    // Метод с campaignId (Заказы)
    const orders = await orderApi.getOrders(campaignId, { status: 'PROCESSING' });

    // Метод с businessId (Каталог/Цены)
    const offers = await assortmentApi.getOfferMappings(businessId, { limit: 100 });

    console.log('Данные получены');
}
```

## Особенности сборки

- **Типизация**: полная поддержка TypeScript (`.d.ts` включены).
- **Стиль имён**:
  - Методы и классы: `camelCase` (например, `orderApi.getOrders`);
  - Свойства объектов (JSON): **original** — сохранено именование из спецификации Яндекса.
- **Аргументы методов**: плоский список (позиционный). Первым параметром в большинстве
  методов идёт `campaignId`, в методах каталога/финтеха — `businessId`. Проверяйте
  сигнатуру через автодополнение в IDE.
- **Fetch**: в среде Node.js < 18 требуется полифил `node-fetch`.

## Ошибки

При ответах 4xx/5xx клиент выбрасывает `ResponseError`. Ответ Яндекса обычно
содержит объект с массивом ошибок.

```javascript
try {
    await orderApi.getOrders(...);
} catch (error) {
    const errorBody = await error.response.json();
    // Структура ошибки Яндекса: { status: "ERROR", errors: [...] }
    console.error('Errors:', errorBody.errors);
}
```

## Отладка (Middleware)

Для отладки сетевых запросов используйте Middleware:

```javascript
const config = new Configuration({
    middleware: [{
        pre: async (context) => {
            console.log(`[Yandex Request] ${context.url}`);
            return context;
        }
    }]
});
```

## Покрытие API

Клиент покрывает **161 операцию** в **43 API-классах** (~757 моделей данных) —
полный охват Yandex Market Partner API. Покрытие поддерживается пайплайном:
каждое изменение спецификации проверяется автоматическими тестами на полноту.

## Postman-коллекция

Готовая Postman Collection v2.1 (161 запрос — все операции спецификации) — отдельный репозиторий
[apilki/yandex-market-postman](https://github.com/apilki/yandex-market-postman)
(`postman/collection.json`). Задайте `apiKey` в авторизации коллекции — она применена
ко всем запросам. Обновляется пайплайном при каждой смене API.

## Тесты

После установки выполните `npm test` — юнит-набор по ключевым путям
(запросы, сериализация, обработка ошибок, middleware). Прогоняется перед
каждой публикацией, работает офлайн — без зависимостей и ключей доступа.

## Известные ограничения

- **Свежесть API — дата коммита спецификации, а не номер версии.** Апстрим
  публикует спецификацию без семантических версий (`LATEST`): номер версии
  есть только у клиента. Поэтому актуальность данных отражается датой в шапке
  README (строка «API от …») и в CHANGELOG релизов — сопоставление по версиям
  спецификации невозможно. Breaking-изменения анонсируются в ⚠-секции
  CHANGELOG и в [MIGRATION.md](MIGRATION.md) (в пакете и GH-дистро).
- **Node.js < 18 — нужен полифил `fetch`.** Клиент работает на встроенном
  `fetch` (ноль зависимостей), нативно доступном с Node 18. На более старых
  версиях установите `node-fetch` и передайте его через
  `Configuration.fetchApi` (подробнее — «Особенности сборки»).
- **Типы коллекционных параметров различаются (`Array` / `Set`)** — наследие
  генерации: часть методов принимает массивы, часть `Set`. Ориентируйтесь на
  сигнатуру метода (подсказки IDE); конвертировать вручную не нужно.

## Языки

- **TypeScript** — этот клиент (JavaScript/TypeScript);
- **Python / Go** — в планах (тот же скоуп `@apilki`, отдельные репозитории).

## Лицензия

MIT © apilki. Клиент сгенерирован из спецификации Yandex Market Partner API
(https://github.com/yandex-market/yandex-market-partner-api), Copyright (c) 2023
YANDEX LLC, лицензирована по BSD 3-Clause. Полный текст — в [LICENSE](LICENSE).

## Ссылки

- [Официальная документация API Яндекс Маркета для продавцов](https://yandex.ru/dev/market/partner-api/doc/ru/)
- [Спецификация API Яндекс Маркета для продавцов](https://github.com/yandex-market/yandex-market-partner-api)
