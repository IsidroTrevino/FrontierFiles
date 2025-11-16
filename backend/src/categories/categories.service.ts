import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private projectsService: ProjectsService,
  ) {}

  async create(
    projectId: string,
    userId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    // Verify user owns the project
    await this.projectsService.findOne(projectId, userId);
    
    const category = new this.categoryModel({
      ...createCategoryDto,
      projectId,
    });
    return category.save();
  }

  async findAll(projectId: string, userId: string): Promise<CategoryDocument[]> {
    // Verify user owns the project
    await this.projectsService.findOne(projectId, userId);
    return this.categoryModel.find({ projectId }).exec();
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return category.save();
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await category.deleteOne();
  }
}
