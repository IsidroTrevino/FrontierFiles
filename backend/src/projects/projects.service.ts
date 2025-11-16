import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Pokemon, PokemonDocument } from '../pokemon/schemas/pokemon.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Pokemon.name) private pokemonModel: Model<PokemonDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: string, createProjectDto: CreateProjectDto): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...createProjectDto,
      userId,
    });
    return project.save();
  }

  async findAll(userId: string): Promise<ProjectDocument[]> {
    return this.projectModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return project;
  }

  async update(
    id: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateProjectDto);
    return project.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    
    // Find all pokemon items in this project
    const pokemonItems = await this.pokemonModel.find({ projectId: id }).exec();
    
    // Delete all files from Cloudinary for each pokemon item
    for (const pokemon of pokemonItems) {
      // Delete main image
      if (pokemon.mainImage?.publicId) {
        try {
          await this.cloudinaryService.deleteFile(pokemon.mainImage.publicId);
        } catch (error) {
          console.error(`Failed to delete main image ${pokemon.mainImage.publicId}:`, error);
        }
      }
      
      // Delete all associated files
      for (const file of pokemon.files) {
        try {
          await this.cloudinaryService.deleteFile(file.publicId);
        } catch (error) {
          console.error(`Failed to delete file ${file.publicId}:`, error);
        }
      }
    }
    
    // Delete all pokemon items from database
    await this.pokemonModel.deleteMany({ projectId: id }).exec();
    
    // Finally, delete the project
    await project.deleteOne();
  }
}
