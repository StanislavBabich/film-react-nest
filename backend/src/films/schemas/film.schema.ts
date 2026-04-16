import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FilmDocument = HydratedDocument<Film>;

@Schema({ _id: false })
export class ScheduleSlot {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  daytime!: string;

  @Prop({ required: true })
  hall!: number;

  @Prop({ required: true })
  rows!: number;

  @Prop({ required: true })
  seats!: number;

  @Prop({ required: true })
  price!: number;

  @Prop({ type: [String], default: [] })
  taken!: string[];
}

export const ScheduleSlotSchema = SchemaFactory.createForClass(ScheduleSlot);

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  rating!: number;

  @Prop({ required: true })
  director!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ required: true })
  image!: string;

  @Prop({ required: true })
  cover!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  about!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: [ScheduleSlotSchema], default: [] })
  schedule!: ScheduleSlot[];
}

export const FilmSchema = SchemaFactory.createForClass(Film);
