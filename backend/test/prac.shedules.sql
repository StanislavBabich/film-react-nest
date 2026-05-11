DROP TABLE IF EXISTS _json_lines;
CREATE TEMP TABLE _json_lines (line TEXT);
\copy _json_lines FROM 'backend/test/mongodb_initial_stub.json'

WITH raw AS (
  SELECT string_agg(line, E'\n')::jsonb AS doc
  FROM _json_lines
),
films AS (
  SELECT jsonb_array_elements(doc) AS film
  FROM raw
),
schedules AS (
  SELECT
    (film->>'id')::uuid AS film_id,
    jsonb_array_elements(film->'schedule') AS slot
  FROM films
)
INSERT INTO schedules (
  id,
  film_id,
  daytime,
  hall,
  rows,
  seats,
  price,
  taken
)
SELECT
  (slot->>'id')::uuid,
  film_id,
  (slot->>'daytime')::timestamptz,
  (slot->>'hall')::integer,
  (slot->>'rows')::integer,
  (slot->>'seats')::integer,
  (slot->>'price')::numeric,
  ARRAY(
    SELECT jsonb_array_elements_text(slot->'taken')
  )::text[]
FROM schedules;

DROP TABLE IF EXISTS _json_lines;
