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
        'Request body must be a non-empty array',
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
              throw new NotFoundException(`Film ${order.film} was not found`);
            case 'session_not_found':
              throw new NotFoundException(`Session ${order.session} was not found`);
            case 'seat_taken':
              throw new ConflictException(
                `Seat ${seatKey} is already taken (film ${order.film}, session ${order.session})`,
              );
            case 'daytime_mismatch':
              throw new BadRequestException(
                `daytime does not match the session in the database (use the string from GET .../schedule)`,
              );
            default:
              throw new BadRequestException(
                'Invalid seat, price does not match the session, or row/seat is out of range',
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
          'The same seat cannot be booked twice in one request',
        );
      }
      seen.add(key);
    }
  }
}
