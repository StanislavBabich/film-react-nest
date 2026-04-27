import { Body, Controller, Post } from '@nestjs/common';

import { OrderResponseDto, OrderTicketDto } from './dto/order.dto';
import { OrderService } from './order.service';

type OrderRequestBody =
  | OrderTicketDto[]
  | {
      email?: string;
      phone?: string;
      tickets?: OrderTicketDto[];
    };

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: OrderRequestBody): Promise<OrderResponseDto> {
    const tickets = Array.isArray(body) ? body : body.tickets ?? [];
    return this.orderService.createOrder(tickets);
  }
}
