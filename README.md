# Cards API

Простой REST API для работы с карточками. Данные хранятся в памяти процесса.

## Запуск

```bash
npm install
npm start
```

## Эндпоинты

### Список карточек

`GET /cards?direction_id={direction_id}&status={status}`

Фильтры опциональны.

**Ответ**

```json
{
  "items": [
    {
      "id": 1,
      "direction_id": "marketing",
      "status": "todo",
      "title": "Создать лендинг",
      "description": "Добавить форму заявки",
      "created_at": "2024-05-01T10:00:00.000Z",
      "updated_at": "2024-05-01T10:00:00.000Z"
    }
  ]
}
```

### Список карточек по направлению

`GET /directions/{direction_id}/cards?status={status}`

**Ответ** аналогичен `GET /cards`.

### Создание карточки

`POST /cards`

**Payload**

```json
{
  "direction_id": "marketing",
  "status": "todo",
  "title": "Создать лендинг",
  "description": "Добавить форму заявки"
}
```

**Ответ**

```json
{
  "id": 1,
  "direction_id": "marketing",
  "status": "todo",
  "title": "Создать лендинг",
  "description": "Добавить форму заявки",
  "created_at": "2024-05-01T10:00:00.000Z",
  "updated_at": "2024-05-01T10:00:00.000Z"
}
```

### Обновление карточки (включая status)

`PUT /cards/{id}`

**Payload** (можно передавать только изменяемые поля)

```json
{
  "status": "in_progress",
  "title": "Обновить лендинг"
}
```

### Удаление карточки

`DELETE /cards/{id}`

## OpenAPI

Описание маршрутов и payload-форматов доступно в `swagger.yaml`.
