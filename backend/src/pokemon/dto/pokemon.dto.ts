import { IsString, IsOptional } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePokemonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  categoryId?: string | null;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsString()
  type?: 'skin' | 'photo' | 'model' | 'other';
}
