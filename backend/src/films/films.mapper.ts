import { FilmDocument, ScheduleSlot } from './schemas/film.schema';
import {
  FilmScheduleResponseDto,
  FilmSummaryDto,
  FilmsListResponseDto,
  SessionDto,
} from './dto/films.dto';

export function filmDocumentToSummaryDto(doc: FilmDocument): FilmSummaryDto {
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

export function scheduleSlotToSessionDto(slot: ScheduleSlot): SessionDto {
  return {
    id: slot.id,
    daytime: slot.daytime,
    hall: String(slot.hall),
    rows: slot.rows,
    seats: slot.seats,
    price: slot.price,
    taken: slot.taken ?? [],
  };
}

export function filmDocumentToListResponse(
  docs: FilmDocument[],
): FilmsListResponseDto {
  return {
    total: docs.length,
    items: docs.map(filmDocumentToSummaryDto),
  };
}

export function filmDocumentToScheduleResponse(
  doc: FilmDocument,
): FilmScheduleResponseDto {
  const items = (doc.schedule ?? []).map(scheduleSlotToSessionDto);
  return {
    total: items.length,
    items,
  };
}
