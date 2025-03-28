import axios from 'axios';

export const baseUrl = process.env.QLU_URL;

const qlu2AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 40 * 1000,
});

export default qlu2AxiosInstance;
