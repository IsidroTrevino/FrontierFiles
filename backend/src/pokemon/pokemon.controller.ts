import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto, UpdatePokemonDto, UpdateFileDto } from './dto/pokemon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post('projects/:projectId/pokemon')
  create(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() createPokemonDto: CreatePokemonDto,
  ) {
    return this.pokemonService.create(projectId, req.user.userId, createPokemonDto);
  }

  @Get('projects/:projectId/pokemon')
  findAll(
    @Request() req,
    @Param('projectId') projectId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.pokemonService.findAll(projectId, req.user.userId, categoryId);
  }

  @Get('pokemon/:id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.pokemonService.findOne(id, req.user.userId);
  }

  @Patch('pokemon/:id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(id, req.user.userId, updatePokemonDto);
  }

  @Delete('pokemon/:id')
  remove(@Request() req, @Param('id') id: string) {
    return this.pokemonService.remove(id, req.user.userId);
  }

  @Post('pokemon/:id/main-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadMainImage(
    @Request() req,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.pokemonService.uploadMainImage(id, req.user.userId, file);
  }

  @Post('pokemon/:id/files')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadFiles(
    @Request() req,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('type') type?: 'skin' | 'photo' | 'model' | 'other',
    @Body('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    return this.pokemonService.uploadFiles(
      id,
      req.user.userId,
      files,
      type,
      folder,
    );
  }

  @Patch('pokemon/:pokemonId/files/:fileId')
  updateFile(
    @Request() req,
    @Param('pokemonId') pokemonId: string,
    @Param('fileId') fileId: string,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    return this.pokemonService.updateFile(
      pokemonId,
      fileId,
      req.user.userId,
      updateFileDto,
    );
  }

  @Delete('pokemon/:pokemonId/files/:fileId')
  deleteFile(
    @Request() req,
    @Param('pokemonId') pokemonId: string,
    @Param('fileId') fileId: string,
  ) {
    return this.pokemonService.deleteFile(pokemonId, fileId, req.user.userId);
  }
}
