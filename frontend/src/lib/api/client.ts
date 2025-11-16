import axios from 'axios';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

const API_URL = import.meta.env.PUBLIC_API_URL;

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request interceptor - add auth token
api.interceptors.request.use(
	(config) => {
		if (browser) {
			const token = localStorage.getItem('token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 && browser) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			goto('/');
		}
		return Promise.reject(error);
	}
);

export default api;
