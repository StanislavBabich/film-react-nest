import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FilmsRepository } from '../films/films.repository';
import {
  OrderConfirmationItemDto,
  OrderResponseDto,
  OrderTicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(orders: OrderTicketDto[]): Promise<OrderResponseDto> {
    if (!Array.isArray(orders) || orders.length === 0) {
      throw new BadRequestException(
        'Тело запроса должно быть непустым массивом',
      );
    }

    this.assertNoDuplicateSeatsInRequest(orders);

    const booked: { filmId: string; sessionId: string; seatKey: string }[] = [];
    const items: OrderConfirmationItemDto[] = [];

    try {
      for (const order of orders) {
        const seatKey = `${order.row}:${order.seat}`;
        const result = await this.filmsRepository.tryBookSeat(
          order.film,
          order.session,
          order.daytime,
          order.row,
          order.seat,
          order.price,
          seatKey,
        );

        if (result.ok === false) {
          switch (result.reason) {
            case 'film_not_found':
              throw new NotFoundException(`Фильм ${order.film} не найден`);
            case 'session_not_found':
              throw new NotFoundException(`Сеанс ${order.session} не найден`);
            case 'seat_taken':
              throw new ConflictException(
                `Место ${seatKey} уже занято (фильм ${order.film}, сеанс ${order.session})`,
              );
            case 'daytime_mismatch':
              throw new BadRequestException(
                `Поле daytime не совпадает с сеансом в базе (ожидается строка как в GET .../schedule для этого сеанса)`,
              );
            default:
              throw new BadRequestException(
                'Некорректное место, цена не совпадает с сеансом или нарушены границы ряда/места',
              );
          }
        }

        booked.push({
          filmId: order.film,
          sessionId: order.session,
          seatKey,
        });
        items.push({
          ...order,
          id: randomUUID(),
        });
      }
    } catch (e) {
      await this.filmsRepository.releaseSeats(booked);
      throw e;
    }

    return { total: items.length, items };
  }

  private assertNoDuplicateSeatsInRequest(orders: OrderTicketDto[]) {
    const seen = new Set<string>();
    for (const o of orders) {
      const key = `${o.film}\0${o.session}\0${o.row}:${o.seat}`;
      if (seen.has(key)) {
        throw new ConflictException(
          'В одном запросе нельзя бронировать одно и то же место дважды',
        );
      }
      seen.add(key);
    }
  }
}
