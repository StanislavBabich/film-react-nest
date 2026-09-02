import json
import os
import re
from pathlib import Path

import psycopg

ROOT = Path(__file__).resolve().parents[1]
STUB = ROOT / "test" / "mongodb_initial_stub.json"
INIT_SQL = (ROOT / "test" / "prac.init.sql").read_text(encoding="utf-8")


def dsn(raw: str) -> str:
    cleaned = re.sub(r"&?channel_binding=require", "", raw)
    cleaned = cleaned.replace("&&", "&").strip("&?")
    if "sslmode=" not in cleaned:
        cleaned += ("&" if "?" in cleaned else "?") + "sslmode=require"
    return cleaned


def main() -> None:
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise SystemExit("DATABASE_URL is not set")

    films = json.loads(STUB.read_text(encoding="utf-8"))
    with psycopg.connect(dsn(url), connect_timeout=10) as conn:
        conn.execute(INIT_SQL)
        conn.execute("TRUNCATE TABLE schedules RESTART IDENTITY CASCADE")
        conn.execute("TRUNCATE TABLE films RESTART IDENTITY CASCADE")

        with conn.cursor() as cur:
            for film in films:
                cur.execute(
                    """
                    INSERT INTO films (
                      id, rating, director, tags, image, cover, title, about, description
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        film["id"],
                        film["rating"],
                        film["director"],
                        film["tags"],
                        film["image"],
                        film["cover"],
                        film["title"],
                        film["about"],
                        film["description"],
                    ),
                )
                for slot in film.get("schedule", []):
                    cur.execute(
                        """
                        INSERT INTO schedules (
                          id, film_id, daytime, hall, rows, seats, price, taken
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            slot["id"],
                            film["id"],
                            slot["daytime"],
                            slot["hall"],
                            slot["rows"],
                            slot["seats"],
                            slot["price"],
                            slot.get("taken") or [],
                        ),
                    )
            cur.execute("SELECT count(*) FROM films")
            film_count = cur.fetchone()[0]
            cur.execute("SELECT title FROM films ORDER BY title")
            titles = [row[0] for row in cur.fetchall()]
            cur.execute("SELECT count(*) FROM schedules")
            slot_count = cur.fetchone()[0]

        conn.commit()

    print(f"Seeded {film_count} films and {slot_count} showtimes")
    for title in titles:
        print(f"- {title}")


if __name__ == "__main__":
    main()
