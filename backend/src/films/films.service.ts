import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmScheduleResponseDto, FilmsListResponseDto } from './dto/films.dto';
import {
  filmDocumentToListResponse,
  filmDocumentToScheduleResponse,
} from './films.mapper';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilmsList(): Promise<FilmsListResponseDto> {
    const docs = await this.filmsRepository.findAll();
    return filmDocumentToListResponse(docs);
  }

  async getFilmSchedule(filmId: string): Promise<FilmScheduleResponseDto> {
    const doc = await this.filmsRepository.findOneByFilmId(filmId);
    if (!doc) {
      throw new NotFoundException(`Film ${filmId} not found`);
    }
    return filmDocumentToScheduleResponse(doc);
  }
}
