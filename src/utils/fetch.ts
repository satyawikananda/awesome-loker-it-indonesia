import axios, {AxiosRequestConfig} from 'axios';
import {BASE_URL} from '../const';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../../.env`,
});

export const fetchData = async (locations: string) => {
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: BASE_URL,
    params: {
      location: locations,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const data = await axios.request(options);
  const result = await data.data.data.jobs.jobs;
  return result;
};
