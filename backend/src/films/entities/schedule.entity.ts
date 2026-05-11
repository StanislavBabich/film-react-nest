import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { FilmEntity } from './film.entity';

@Entity({ name: 'schedules' })
export class ScheduleEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'timestamptz' })
  daytime!: Date;

  @Column({ type: 'integer' })
  hall!: number;

  @Column({ type: 'integer' })
  rows!: number;

  @Column({ type: 'integer' })
  seats!: number;

  @Column({
    type: 'numeric',
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  price!: number;

  @Column('text', { array: true, default: () => "'{}'" })
  taken!: string[];

  @Column({ name: 'film_id', type: 'uuid' })
  filmId!: string;

  @ManyToOne(() => FilmEntity, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film!: FilmEntity;
}
