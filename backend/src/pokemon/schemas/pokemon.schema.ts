import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PokemonDocument = Pokemon & Document;

@Schema({ _id: true })
export class PokemonFile {
  _id?: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ enum: ['skin', 'photo', 'model', 'other'], default: 'other' })
  type: string;

  @Prop()
  folder?: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

@Schema({ _id: false })
export class MainImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;
}

@Schema({ timestamps: true })
export class Pokemon {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop({ type: MainImage })
  mainImage?: MainImage;

  @Prop()
  notes?: string;

  @Prop({ type: [PokemonFile], default: [] })
  files: Types.DocumentArray<PokemonFile>;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
