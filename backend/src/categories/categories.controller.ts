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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('projects/:projectId/categories')
  create(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(projectId, req.user.userId, createCategoryDto);
  }

  @Get('projects/:projectId/categories')
  findAll(@Request() req, @Param('projectId') projectId: string) {
    return this.categoriesService.findAll(projectId, req.user.userId);
  }

  @Patch('categories/:id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
