  import axios from 'axios';

// Priority:
// 1. Vercel Environment Variable (REACT_APP_API_URL) -> If deployed
// 2. Localhost (http://localhost:5000) -> If developing locally
const BASE_URL =  'https://collegesyncmca.onrender.com' || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // Automatically adds /api to every request
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;


