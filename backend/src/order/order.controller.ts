import { Body, Controller, Post } from '@nestjs/common';

import { OrderResponseDto, OrderTicketDto } from './dto/order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: OrderTicketDto[]): Promise<OrderResponseDto> {
    return this.orderService.createOrder(body);
  }
}
