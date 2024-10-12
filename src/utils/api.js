// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Use a relative path
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
    const response = await api.get(`/properties?${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};
