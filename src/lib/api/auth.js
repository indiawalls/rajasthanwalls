import axios from 'axios';

export async function loginAdmin({ email, password }) {
    return axios.post('/api/auth/login', { email, password });
}