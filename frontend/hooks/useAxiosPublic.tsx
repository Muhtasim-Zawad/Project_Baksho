import axios from "axios";

const url = 'http://localhost:1234';

export const axiosPublic = axios.create({
  baseURL: url,
});