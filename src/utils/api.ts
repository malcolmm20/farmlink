import { config } from '../config';

export const getApiUrl = (path: string): string => {
  return `${config.apiUrl}${path}`;
}; 