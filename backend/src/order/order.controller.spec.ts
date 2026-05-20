import { Test, TestingModule } from '@nestjs/testing';

import { OrderTicketDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: jest.Mocked<Pick<OrderService, 'createOrder'>>;

  beforeEach(async () => {
    const mockService: jest.Mocked<Pick<OrderService, 'createOrder'>> = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: mockService }],
    }).compile();

    controller = module.get(OrderController);
    service = module.get(OrderService);
  });

  describe('createOrder', () => {
    it('passes the ticket array when the body is a raw array', async () => {
      const tickets: OrderTicketDto[] = [];
      const response = { total: 0, items: [] };
      service.createOrder.mockResolvedValue(response);

      await expect(controller.createOrder(tickets)).resolves.toBe(response);
      expect(service.createOrder).toHaveBeenCalledWith(tickets);
    });

    it('uses tickets from object body when present', async () => {
      const tickets: OrderTicketDto[] = [];
      const response = { total: 0, items: [] };
      service.createOrder.mockResolvedValue(response);

      await expect(
        controller.createOrder({ email: 'a@b.c', tickets }),
      ).resolves.toBe(response);
      expect(service.createOrder).toHaveBeenCalledWith(tickets);
    });

    it('sends an empty list when object body has no tickets field', async () => {
      const response = { total: 0, items: [] };
      service.createOrder.mockResolvedValue(response);

      await expect(controller.createOrder({ phone: '1' })).resolves.toBe(
        response,
      );
      expect(service.createOrder).toHaveBeenCalledWith([]);
    });
  });
});
