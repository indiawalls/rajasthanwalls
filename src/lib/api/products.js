import axios from 'axios';

export async function uploadProduct(formData) {
    return axios.post('/api/product/upload', formData);
}