from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

DEFAULT_DIRECTIONS: tuple[str, ...] = (
    "Здоровье",
    "Карьера",
    "Финансы",
    "Отношения",
    "Личностный рост",
    "Отдых",
    "Дом",
    "Социальная жизнь",
    "Духовность",
    "Творчество",
)


def ensure_seed(data_path: str | Path = "data/directions.json") -> bool:
    """Create the directions seed file if it does not exist.

    Returns True when the file is created, False when it already exists.
    """
    path = Path(data_path)
    if path.exists():
        return False

    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"directions": list(DEFAULT_DIRECTIONS)}
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return True


def seed_from_iterable(
    directions: Iterable[str],
    data_path: str | Path = "data/directions.json",
) -> bool:
    """Create the directions seed file from the provided iterable if missing."""
    path = Path(data_path)
    if path.exists():
        return False

    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"directions": list(directions)}
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return True
