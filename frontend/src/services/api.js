import axios from 'axios';

const API_URL = 'http://127.0.0.1:5050/api';

export const getStats = () => axios.get(`${API_URL}/stats`);
export const getExpenses = (params) => axios.get(`${API_URL}/expenses`, { params });
export const getExpense = (id) => axios.get(`${API_URL}/expenses/${id}`);
export const addExpense = (data) => axios.post(`${API_URL}/expenses`, data);
export const updateExpense = (id, data) => axios.put(`${API_URL}/expenses/${id}`, data);
export const deleteExpense = (id) => axios.delete(`${API_URL}/expenses/${id}`);
