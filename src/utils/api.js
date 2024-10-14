// src/utils/api.js
import axios from 'axios';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? '/api' // In production, use the same domain
    : 'http://localhost:3000/api'; // In development, point to the local server

const api = axios.create({
  baseURL: baseURL, // Explicitly set the baseURL property
});

export const fetchProperties = async () => {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};
