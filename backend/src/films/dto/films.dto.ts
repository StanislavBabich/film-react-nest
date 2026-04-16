export class FilmSummaryDto {
  id!: string;
  rating!: number;
  director!: string;
  tags!: string[];
  title!: string;
  about!: string;
  description!: string;
  image!: string;
  cover!: string;
}

export class FilmsListResponseDto {
  total!: number;
  items!: FilmSummaryDto[];
}

export class SessionDto {
  id!: string;
  daytime!: string;
  hall!: string;
  rows!: number;
  seats!: number;
  price!: number;
  taken!: string[];
}

export class FilmScheduleResponseDto {
  total!: number;
  items!: SessionDto[];
}
