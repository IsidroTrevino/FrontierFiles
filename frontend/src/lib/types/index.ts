// Re-export types from shared package (or define locally if not using shared package)

export interface User {
	_id: string;
	email: string;
	name?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Project {
	_id: string;
	name: string;
	description?: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface Category {
	_id: string;
	name: string;
	projectId: string;
	color?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface PokemonFile {
	_id: string;
	name: string;
	type: 'skin' | 'photo' | 'model' | 'other';
	folder?: string;
	url: string;
	publicId: string;
	uploadedAt: Date;
}

export interface Pokemon {
	_id: string;
	name: string;
	projectId: string;
	categoryId?: string | Category;
	mainImage?: {
		url: string;
		publicId: string;
	};
	notes?: string;
	files: PokemonFile[];
	createdAt: Date;
	updatedAt: Date;
}

// DTOs
export interface RegisterDto {
	email: string;
	password: string;
	name?: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface CreateProjectDto {
	name: string;
	description?: string;
}

export interface UpdateProjectDto {
	name?: string;
	description?: string;
}

export interface CreateCategoryDto {
	name: string;
	color?: string;
}

export interface UpdateCategoryDto {
	name?: string;
	color?: string;
}

export interface CreatePokemonDto {
	name: string;
	categoryId?: string;
	notes?: string;
}

export interface UpdatePokemonDto {
	name?: string;
	categoryId?: string;
	notes?: string;
}

export interface UpdateFileDto {
	name?: string;
	folder?: string;
	type?: 'skin' | 'photo' | 'model' | 'other';
}

export interface AuthResponse {
	user: User;
	access_token: string;
}
