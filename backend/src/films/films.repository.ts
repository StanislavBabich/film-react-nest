import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument } from './schemas/film.schema';

export type BookSeatFailureReason =
  | 'film_not_found'
  | 'session_not_found'
  | 'seat_taken'
  | 'daytime_mismatch'
  | 'invalid_seat_or_price';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  findAll(): Promise<FilmDocument[]> {
    return this.filmModel.find().lean().exec() as Promise<FilmDocument[]>;
  }

  findOneByFilmId(filmId: string): Promise<FilmDocument | null> {
    return this.filmModel
      .findOne({ id: filmId })
      .lean()
      .exec() as Promise<FilmDocument | null>;
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

    const res = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            daytime,
            taken: { $nin: [seatKey] },
            rows: { $gte: row },
            seats: { $gte: seat },
            price,
          },
        },
      },
      { $push: { 'schedule.$.taken': seatKey } },
    );

    if (res.modifiedCount === 1) {
      return { ok: true };
    }

    const film = await this.findOneByFilmId(filmId);
    if (!film) {
      return { ok: false, reason: 'film_not_found' };
    }
    const slot = film.schedule?.find((s) => s.id === sessionId);
    if (!slot) {
      return { ok: false, reason: 'session_not_found' };
    }
    if (slot.taken?.includes(seatKey)) {
      return { ok: false, reason: 'seat_taken' };
    }
    if (slot.daytime !== daytime) {
      return { ok: false, reason: 'daytime_mismatch' };
    }
    return { ok: false, reason: 'invalid_seat_or_price' };
  }

  async releaseSeats(
    bookings: { filmId: string; sessionId: string; seatKey: string }[],
  ): Promise<void> {
    for (let i = bookings.length - 1; i >= 0; i--) {
      const b = bookings[i];
      await this.filmModel.updateOne(
        { id: b.filmId },
        {
          $pull: {
            'schedule.$[s].taken': b.seatKey,
          },
        },
        { arrayFilters: [{ 's.id': b.sessionId }] },
      );
    }
  }
}
