import axios from 'axios';

// Under local development, set this to your machine's local IP address
// React Native on virtual emulators requires the host IP instead of localhost.
const BASE_URL = 'http://10.0.2.2:8000/api/v1'; // Default Android emulator host address

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
