TRUNCATE TABLE schedules RESTART IDENTITY;
TRUNCATE TABLE films RESTART IDENTITY CASCADE;

DROP TABLE IF EXISTS _json_lines;
CREATE TEMP TABLE _json_lines (line TEXT);
\copy _json_lines FROM 'backend/test/mongodb_initial_stub.json'

WITH raw AS (
  SELECT string_agg(line, E'\n')::jsonb AS doc
  FROM _json_lines
),
docs AS (
  SELECT jsonb_array_elements(doc) AS film
  FROM raw
)
INSERT INTO films (
  id,
  rating,
  director,
  tags,
  image,
  cover,
  title,
  about,
  description
)
SELECT
  (film->>'id')::uuid,
  (film->>'rating')::real,
  film->>'director',
  ARRAY(
    SELECT jsonb_array_elements_text(film->'tags')
  )::text[],
  film->>'image',
  film->>'cover',
  film->>'title',
  film->>'about',
  film->>'description'
FROM docs;

DROP TABLE IF EXISTS _json_lines;
