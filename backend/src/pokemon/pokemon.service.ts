import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pokemon, PokemonDocument } from './schemas/pokemon.schema';
import { CreatePokemonDto, UpdatePokemonDto, UpdateFileDto } from './dto/pokemon.dto';
import { ProjectsService } from '../projects/projects.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>,
    private projectsService: ProjectsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(
    projectId: string,
    userId: string,
    createPokemonDto: CreatePokemonDto,
  ): Promise<PokemonDocument> {
    // Verify user owns the project
    await this.projectsService.findOne(projectId, userId);

    const pokemon = new this.pokemonModel({
      ...createPokemonDto,
      projectId,
      categoryId: createPokemonDto.categoryId || null,
    });
    return pokemon.save();
  }

  async findAll(
    projectId: string,
    userId: string,
    categoryId?: string,
  ): Promise<PokemonDocument[]> {
    // Verify user owns the project
    await this.projectsService.findOne(projectId, userId);

    const query: any = { projectId };
    if (categoryId) {
      query.categoryId = new Types.ObjectId(categoryId);
    }

    return this.pokemonModel.find(query).populate('categoryId').exec();
  }

  async findOne(id: string, userId?: string): Promise<PokemonDocument> {
    const pokemon = await this.pokemonModel
      .findById(id)
      .populate('categoryId')
      .exec();

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    // Verify ownership if userId provided
    if (userId) {
      await this.projectsService.findOne(pokemon.projectId.toString(), userId);
    }

    return pokemon;
  }

  async update(
    id: string,
    userId: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<PokemonDocument> {
    const pokemon = await this.findOne(id, userId);
    
    // Handle categoryId explicitly to allow clearing it
    if ('categoryId' in updatePokemonDto) {
      const categoryId = updatePokemonDto.categoryId;
      pokemon.categoryId = (categoryId && categoryId.trim() !== '') 
        ? new Types.ObjectId(categoryId)
        : null;
    }
    if (updatePokemonDto.name !== undefined) {
      pokemon.name = updatePokemonDto.name;
    }
    if (updatePokemonDto.notes !== undefined) {
      pokemon.notes = updatePokemonDto.notes;
    }
    
    return pokemon.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const pokemon = await this.findOne(id, userId);

    // Delete main image from Cloudinary
    if (pokemon.mainImage?.publicId) {
      await this.cloudinaryService.deleteFile(pokemon.mainImage.publicId);
    }

    // Delete all files from Cloudinary
    for (const file of pokemon.files) {
      await this.cloudinaryService.deleteFile(file.publicId);
    }

    await pokemon.deleteOne();
  }

  async uploadMainImage(
    id: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<PokemonDocument> {
    const pokemon = await this.findOne(id, userId);

    // Delete old main image if exists
    if (pokemon.mainImage?.publicId) {
      await this.cloudinaryService.deleteFile(pokemon.mainImage.publicId);
    }

    // Upload new image
    const result = await this.cloudinaryService.uploadFile(
      file,
      `${pokemon.projectId}/${pokemon._id}`,
    );

    pokemon.mainImage = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    return pokemon.save();
  }

  async uploadFiles(
    id: string,
    userId: string,
    files: Express.Multer.File[],
    type: 'skin' | 'photo' | 'model' | 'other' = 'other',
    folder?: string,
  ): Promise<PokemonDocument> {
    const pokemon = await this.findOne(id, userId);

    for (const file of files) {
      const result = await this.cloudinaryService.uploadFile(
        file,
        `${pokemon.projectId}/${pokemon._id}`,
      );

      pokemon.files.push({
        name: file.originalname,
        type,
        folder,
        url: result.secure_url,
        publicId: result.public_id,
        uploadedAt: new Date(),
      });
    }

    return pokemon.save();
  }

  async updateFile(
    pokemonId: string,
    fileId: string,
    userId: string,
    updateFileDto: UpdateFileDto,
  ): Promise<PokemonDocument> {
    const pokemon = await this.findOne(pokemonId, userId);

    const file = pokemon.files.id(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    Object.assign(file, updateFileDto);
    return pokemon.save();
  }

  async deleteFile(
    pokemonId: string,
    fileId: string,
    userId: string,
  ): Promise<PokemonDocument> {
    const pokemon = await this.findOne(pokemonId, userId);

    const file = pokemon.files.id(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    // Delete from Cloudinary
    await this.cloudinaryService.deleteFile(file.publicId);

    // Remove from array
    pokemon.files.pull(fileId);
    return pokemon.save();
  }
}
