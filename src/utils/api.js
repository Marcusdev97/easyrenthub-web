import axios from 'axios';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.REACT_APP_API_URL_DEVELOPMENT
    : process.env.REACT_APP_API_URL_PRODUCTION;

export const fetchProperties = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/properties`);
    // 后端返回的数据会包含图片的完整 URL
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchPropertyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};
