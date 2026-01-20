from __future__ import annotations

from seed import ensure_seed


def main() -> None:
    created = ensure_seed()
    if created:
        print("Создано начальное наполнение направлений.")
    else:
        print("Начальное наполнение направлений уже существует.")


if __name__ == "__main__":
    main()
