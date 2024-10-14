import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://myeasyrenthub.com/api'  // For production
    : 'http://localhost:8080/api',     // For development
});

// Fetch all properties
export const fetchProperties = async () => {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Fetch property by ID
export const fetchPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};
