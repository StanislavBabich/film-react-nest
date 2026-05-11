import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

export type BookSeatFailureReason =
  | 'film_not_found'
  | 'session_not_found'
  | 'seat_taken'
  | 'daytime_mismatch'
  | 'invalid_seat_or_price';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  findAll(): Promise<FilmEntity[]> {
    return this.filmRepository.find();
  }

  findOneByFilmId(filmId: string): Promise<FilmEntity | null> {
    return this.filmRepository.findOne({
      where: { id: filmId },
      relations: { schedule: true },
      order: { schedule: { daytime: 'ASC' } },
    });
  }

  async tryBookSeat(
    filmId: string,
    sessionId: string,
    daytime: string,
    row: number,
    seat: number,
    price: number,
    seatKey: string,
  ): Promise<{ ok: true } | { ok: false; reason: BookSeatFailureReason }> {
    if (row < 1 || seat < 1) {
      return { ok: false, reason: 'invalid_seat_or_price' };
    }

    const parsedDaytime = new Date(daytime);
    const updateResult = await this.scheduleRepository
      .createQueryBuilder()
      .update(ScheduleEntity)
      .set({
        taken: () => 'array_append(taken, :seatKey)',
      })
      .where('id = :sessionId', { sessionId })
      .andWhere('film_id = :filmId', { filmId })
      .andWhere('daytime = :daytime', {
        daytime: parsedDaytime.toISOString(),
      })
      .andWhere('rows >= :row', { row })
      .andWhere('seats >= :seat', { seat })
      .andWhere('price = :price', { price })
      .andWhere('NOT (:seatKey = ANY(taken))', { seatKey })
      .setParameter('seatKey', seatKey)
      .execute();

    if ((updateResult.affected ?? 0) === 1) {
      return { ok: true };
    }

    const film = await this.filmRepository.findOne({ where: { id: filmId } });
    if (!film) {
      return { ok: false, reason: 'film_not_found' };
    }
    const slot = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });
    if (!slot) {
      return { ok: false, reason: 'session_not_found' };
    }
    if ((slot.taken ?? []).includes(seatKey)) {
      return { ok: false, reason: 'seat_taken' };
    }
    if (slot.daytime.toISOString() !== parsedDaytime.toISOString()) {
      return { ok: false, reason: 'daytime_mismatch' };
    }
    return { ok: false, reason: 'invalid_seat_or_price' };
  }

  async releaseSeats(
    bookings: { filmId: string; sessionId: string; seatKey: string }[],
  ): Promise<void> {
    for (let i = bookings.length - 1; i >= 0; i--) {
      const b = bookings[i];
      await this.scheduleRepository
        .createQueryBuilder()
        .update(ScheduleEntity)
        .set({
          taken: () => 'array_remove(taken, :seatKey)',
        })
        .where('id = :sessionId', { sessionId: b.sessionId })
        .andWhere('film_id = :filmId', { filmId: b.filmId })
        .setParameter('seatKey', b.seatKey)
        .execute();
    }
  }
}
