import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://myeasyrenthub.com' : 'http://localhost:3000',
});

export const fetchProperties = async () => {
  try {
    const response = await api.get('/api/properties');
    // 后端返回的数据会包含图片的完整 URL
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchPropertyById = async (id) => {
  try {
    const response = await api.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};
