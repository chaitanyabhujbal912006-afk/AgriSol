/**
 * Centralised API configuration
 * - In development: reads from .env.development → VITE_API_URL = http://localhost:5000/api/v1
 * - In production (Vercel): reads VITE_API_URL from Vercel Environment Variables dashboard
 */
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1';

export default API_BASE_URL;
