import { Test, TestingModule } from '@nestjs/testing';

import { FilmsListResponseDto } from './dto/films.dto';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: jest.Mocked<
    Pick<FilmsService, 'getFilmsList' | 'getFilmSchedule'>
  >;

  beforeEach(async () => {
    const mockService: jest.Mocked<
      Pick<FilmsService, 'getFilmsList' | 'getFilmSchedule'>
    > = {
      getFilmsList: jest.fn(),
      getFilmSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: mockService }],
    }).compile();

    controller = module.get(FilmsController);
    service = module.get(FilmsService);
  });

  describe('HTTP delegation to FilmsService', () => {
    it('getFilms returns the list from the service', async () => {
      const payload: FilmsListResponseDto = { total: 0, items: [] };
      service.getFilmsList.mockResolvedValue(payload);

      await expect(controller.getFilms()).resolves.toBe(payload);
      expect(service.getFilmsList).toHaveBeenCalledTimes(1);
    });

    it('getSchedule passes the route id to the service', async () => {
      const schedule = { total: 0, items: [] };
      service.getFilmSchedule.mockResolvedValue(schedule);

      await expect(controller.getSchedule('film-1')).resolves.toBe(schedule);
      expect(service.getFilmSchedule).toHaveBeenCalledWith('film-1');
    });
  });
});
