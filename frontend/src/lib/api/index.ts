import api from './client';
import type {
	RegisterDto,
	LoginDto,
	AuthResponse,
	User,
	Project,
	CreateProjectDto,
	UpdateProjectDto,
	Category,
	CreateCategoryDto,
	UpdateCategoryDto,
	Pokemon,
	CreatePokemonDto,
	UpdatePokemonDto,
	UpdateFileDto
} from '../types';

// Auth API
export const authApi = {
	register: (data: RegisterDto) => api.post<AuthResponse>('/auth/register', data),
	login: (data: LoginDto) => api.post<AuthResponse>('/auth/login', data),
	getProfile: () => api.get<User>('/auth/me')
};

// Projects API
export const projectsApi = {
	getAll: () => api.get<Project[]>('/projects'),
	getOne: (id: string) => api.get<Project>(`/projects/${id}`),
	create: (data: CreateProjectDto) => api.post<Project>('/projects', data),
	update: (id: string, data: UpdateProjectDto) => api.patch<Project>(`/projects/${id}`, data),
	delete: (id: string) => api.delete(`/projects/${id}`)
};

// Categories API
export const categoriesApi = {
	getAll: (projectId: string) => api.get<Category[]>(`/projects/${projectId}/categories`),
	create: (projectId: string, data: CreateCategoryDto) =>
		api.post<Category>(`/projects/${projectId}/categories`, data),
	update: (id: string, data: UpdateCategoryDto) => api.patch<Category>(`/categories/${id}`, data),
	delete: (id: string) => api.delete(`/categories/${id}`)
};

// Pokemon API
export const pokemonApi = {
	getAll: (projectId: string, categoryId?: string) => {
		const params = categoryId ? { categoryId } : {};
		return api.get<Pokemon[]>(`/projects/${projectId}/pokemon`, { params });
	},
	getOne: (id: string) => api.get<Pokemon>(`/pokemon/${id}`),
	create: (projectId: string, data: CreatePokemonDto) =>
		api.post<Pokemon>(`/projects/${projectId}/pokemon`, data),
	update: (id: string, data: UpdatePokemonDto) => api.patch<Pokemon>(`/pokemon/${id}`, data),
	delete: (id: string) => api.delete(`/pokemon/${id}`),

	// File operations
	uploadMainImage: (id: string, file: File) => {
		const formData = new FormData();
		formData.append('file', file);
		return api.post<Pokemon>(`/pokemon/${id}/main-image`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	},

	uploadFiles: (id: string, files: File[], type?: string, folder?: string) => {
		const formData = new FormData();
		files.forEach((file) => formData.append('files', file));
		if (type) formData.append('type', type);
		if (folder) formData.append('folder', folder);
		return api.post<Pokemon>(`/pokemon/${id}/files`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	},

	updateFile: (pokemonId: string, fileId: string, data: UpdateFileDto) =>
		api.patch<Pokemon>(`/pokemon/${pokemonId}/files/${fileId}`, data),

	deleteFile: (pokemonId: string, fileId: string) =>
		api.delete<Pokemon>(`/pokemon/${pokemonId}/files/${fileId}`)
};
