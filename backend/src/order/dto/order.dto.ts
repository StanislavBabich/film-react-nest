export class OrderTicketDto {
  film!: string;
  session!: string;
  daytime!: string;
  row!: number;
  seat!: number;
  price!: number;
}

export class OrderConfirmationItemDto {
  film!: string;
  session!: string;
  daytime!: string;
  row!: number;
  seat!: number;
  price!: number;
  id!: string;
}

export class OrderResponseDto {
  total!: number;
  items!: OrderConfirmationItemDto[];
}
