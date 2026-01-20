# test

test

## Entity descriptions

### Direction
* 10 fixed categories that represent high-level product/work directions.
* **Required fields**:
  * `id` (primary key)
  * `name` (unique)
  * `created_at`
  * `updated_at`

### Card
* Task item that belongs to exactly one direction.
* **Required fields**:
  * `id` (primary key)
  * `title`
  * `description`
  * `direction_id` (FK → `directions.id`)
  * `status` (column status)
  * `created_at`
  * `updated_at`

### Column statuses
* Fixed set of statuses such as: `backlog`, `in_progress`, `done`.

## Database schema / migration

```sql
-- directions: fixed catalog of 10 categories
CREATE TABLE directions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- cards: tasks belonging to a direction (1-N)
CREATE TABLE cards (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  direction_id BIGINT NOT NULL REFERENCES directions(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('backlog', 'in_progress', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
