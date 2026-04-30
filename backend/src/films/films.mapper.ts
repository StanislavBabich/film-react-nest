import {
  FilmScheduleResponseDto,
  FilmSummaryDto,
  FilmsListResponseDto,
  SessionDto,
} from './dto/films.dto';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

export function filmDocumentToSummaryDto(doc: FilmEntity): FilmSummaryDto {
  return {
    id: doc.id,
    rating: doc.rating,
    director: doc.director,
    tags: doc.tags ?? [],
    title: doc.title,
    about: doc.about,
    description: doc.description,
    image: doc.image,
    cover: doc.cover,
  };
}

export function scheduleSlotToSessionDto(slot: ScheduleEntity): SessionDto {
  return {
    id: slot.id,
    daytime:
      slot.daytime instanceof Date
        ? slot.daytime.toISOString()
        : new Date(slot.daytime).toISOString(),
    hall: slot.hall,
    rows: slot.rows,
    seats: slot.seats,
    price: slot.price,
    taken: slot.taken ?? [],
  };
}

export function filmDocumentToListResponse(
  docs: FilmEntity[],
): FilmsListResponseDto {
  return {
    total: docs.length,
    items: docs.map(filmDocumentToSummaryDto),
  };
}

export function filmDocumentToScheduleResponse(
  doc: FilmEntity,
): FilmScheduleResponseDto {
  const items = (doc.schedule ?? []).map(scheduleSlotToSessionDto);
  return {
    total: items.length,
    items,
  };
}
