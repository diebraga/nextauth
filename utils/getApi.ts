import axios, { AxiosResponse } from 'axios';

export default async function api(path: string): Promise<AxiosResponse> {
  return axios.get(path);
}