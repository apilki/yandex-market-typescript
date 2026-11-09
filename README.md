# @apilki/yandex-market

TypeScript/JavaScript клиент для **Yandex Market Partner API** (продавец-сторона: заказы, каталог, цены, отчёты). Построен на базе `fetch` API. Публикуется в npm-скоупе `@apilki` (GitHub-орг `apilki`).

## Особенности сборки
- **Типизация**: Полная поддержка TypeScript (`.d.ts` включены).
- **Стиль имен**: 
  - Методы и классы: `camelCase` (например, `orderApi.getOrders`).
  - Свойства объектов (JSON): **Original** (сохранено именование из спецификации Яндекса, обычно это `camelCase`).
- **Аргументы методов**: Плоский список (позиционный). Первым параметром в большинстве методов идет `campaignId`.

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

## 2. Работа с несколькими кабинетами или магазинами

В зависимости от метода API Яндекса, первым аргументом может выступать либо **campaignId** (идентификатор магазина), либо **businessId** (идентификатор бизнеса/кабинета). Ключ авторизации `Api-Key` уже находится в заголовках конфигурации, поэтому он не требуется в аргументах.

```javascript
const campaignId = 12345678; 
const businessId = 987654;

async function fetchData() {
    try {
        // Пример метода с campaignId (Заказы)
        const orders = await orderApi.getOrders(campaignId, { status: 'PROCESSING' });

        // Пример метода с businessId (Каталог/Цены)
        const offers = await assortmentApi.getOfferMappings(businessId, { limit: 100 });
        
        console.log('Данные получены');
    } catch (error) {
        console.error('Yandex API Error:', error);
    }
}
```

### 3. Обработка ошибок

В случае ошибок 4xx/5xx клиент выбрасывает ResponseError. Ответ Яндекса обычно содержит объект с массивом ошибок.

```javascript
try {
    await orderApi.getOrders(...);
} catch (error) {
    const errorBody = await error.response.json();
    // Структура ошибки Яндекса: { status: "ERROR", errors: [...] }
    console.error('Errors:', errorBody.errors);
}
```

### 4. Отладка (Middleware)

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

### Важные замечания

Порядок аргументов: В большинстве методов Яндекса первым аргументом идет campaignId. Всегда проверяйте сигнатуру метода через автодополнение в IDE.

**Идентификаторы (ID):** Внимательно следите за сигнатурой метода в IDE.
* Если метод относится к операциям магазина — первым аргументом идет campaignId.
* Если к настройкам каталога или финтеху — первым аргументом идет businessId.

**JSON:** Мы сохранили оригинальное именование полей. Если поле в документации Яндекса называется deliveryServiceId, в коде оно будет точно таким же.

**Fetch:** В среде Node.js < 18 требуется полифил node-fetch.

**Авторизация:** Если Api-Key не задан в Configuration, он может потребоваться первым аргументом в каждом методе. Проверяйте подсказки IDE.

### Ссылки

* [Официальная документация API Яндекс Маркета для продавцов](https://yandex.ru/dev/market/partner-api/doc/ru/)
* [Спецификация API Яндекс Маркета для продавцов](https://github.com/yandex-market/yandex-market-partner-api)