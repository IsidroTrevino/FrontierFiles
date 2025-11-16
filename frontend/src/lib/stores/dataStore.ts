import { writable } from 'svelte/store';
import type { Project, Category, Pokemon } from '$lib/types';

export const selectedProjectStore = writable<Project | null>(null);
export const categoriesStore = writable<Category[]>([]);
export const pokemonStore = writable<Pokemon[]>([]);
export const selectedCategoryStore = writable<string | null>(null);
export const selectedPokemonStore = writable<Pokemon | null>(null);
