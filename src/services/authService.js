import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: 'application/json' },
});

export async function login(email) {
  const { data } = await client.post('/auth/login', { email });
  return data;
}

export async function checkStatus(email) {
  const { data } = await client.get('/auth/status', { params: { email } });
  return data;
}

export async function logout(token) {
  const { data } = await client.post('/auth/logout', null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function me(token) {
  const { data } = await client.get('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
