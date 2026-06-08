# Каталог земельных участков

Интерактивный каталог с картой. Данные подтягиваются из Google Sheets.

## Подключение Google Sheets

1. Открой [Google Sheets](https://sheets.google.com) и создай таблицу
2. Назови первый лист `Объекты`
3. Первая строка — заголовки (скопируй точно):

| name | cadastral | address | lat | lng | area_ha | price | land_category | vri | utilities | status | photos | description | extra_field_1 | extra_field_2 |
|------|-----------|---------|-----|-----|---------|-------|---------------|-----|-----------|--------|--------|-------------|----------------|----------------|
| Участок у д. Петрово | 50:09:0060301:119 | МО, Раменский р-н | 55.601 | 38.214 | 2.5 | 3500000 | Земли с/х назначения | ЛПХ | Электричество 200м | available | https://... | Описание | Рельеф | Доп. инфо |

**Статусы:** `available` — продаётся, `reserved` — зарезервирован, `sold` — продан

**Фото:** через запятую можно указать несколько URL (Google Drive, Яндекс.Диск публичная ссылка, Imgur)

4. Опубликуй таблицу: Файл → Поделиться → Опубликовать в интернете → Опубликовать
5. Скопируй ID из адресной строки: `https://docs.google.com/spreadsheets/d/`**ВОТ_ЭТО_ID**`/edit`
6. В файле `app.js` замени строку:
   ```js
   const SHEET_ID = 'YOUR_SHEET_ID';
   ```
   на свой ID, например:
   ```js
   const SHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms';
   ```

## Координаты (lat/lng)

Чтобы узнать координаты участка:
- Открой [Google Maps](https://maps.google.com) или [Яндекс.Карты](https://yandex.ru/maps)
- Кликни правой кнопкой на участок → «Что здесь?»
- Скопируй широту (lat) и долготу (lng)

## Деплой на Netlify

1. Зайди на [netlify.com](https://netlify.com) → Sign up через GitHub
2. New site → Import an existing project → GitHub → выбери `land-catalog`
3. Deploy site — сайт появится через ~1 минуту
4. Свой домен: Site settings → Domain management → Add custom domain

## Обновление объектов

Просто редактируй Google Sheets — сайт подтянет новые данные при следующем открытии (без перезагрузки кода).
