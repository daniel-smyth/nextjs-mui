import { AxiosResponse } from 'axios';
import { AuthToken } from 'types/auth';
import { User } from 'types/user';
import axios from 'utils/axios';

export const getMeApi = (): Promise<AxiosResponse<User>> =>
  axios.get('/users/me');

export const getTokenApi = (): Promise<AxiosResponse<AuthToken>> =>
  axios.get('/auth/token');

export const signUpApi = (data: FormData) => axios.post('/auth/signup', data);
