import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig, isAxiosError } from "axios";
import {TokensHelper} from "@helpers";
import {setIsRefreshing, setTokens} from "@redux/sessionSlice";
import store from "@redux/store";
import * as SessionService from "./SessionService";

interface ResponseData {
  status: string;
  message: string;
  data?: any;
  error?: any;
}

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API] ${config.url}`);
    const tokens = TokensHelper.getTokens();
    config.headers.Authorization = `Bearer ${tokens?.access_token}`;
    return config;
  },
  (error: AxiosError) => {
    console.log(`[API] ${error.config?.method} ${error.config?.url} [Error]`);

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    console.log(`[API] ${response.config.method} ${response.config.url} [${response.status}]`);

    return Promise.resolve(response);
  },
  async (error: AxiosError<ResponseData>) => {
    console.log(`[API] ${error.config?.method} ${error.config?.url} [${error.response?.status}]`);
    if (error.response && error.response.status === 401 && !store.getState().session.isRefreshing) {
      // fetch tokens
      try {
        store.dispatch(setIsRefreshing(true));
        const tokens = await SessionService.refreshTokensAsync(TokensHelper.getTokens()!);
        TokensHelper.setTokens(tokens);
        store.dispatch(setTokens(tokens));
      } catch(error) {
        if (isAxiosError(error) && error.response?.status == 422) {
          TokensHelper.eraseTokens();
          store.dispatch(setTokens(null));
        } 

        return Promise.reject(error);
      } finally {
        store.dispatch(setIsRefreshing(false));
      }

      if (error.config) {
        return axios.request(error.config);
      }
    }

    // Debug
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log(error.message);
    }

    return Promise.reject(error);
  }
);

export async function _get(url: string, config?: AxiosRequestConfig) {
  const response = await axiosInstance.get<ResponseData>(url, config);
  return response.data.data;
}

export async function _post(url: string, data?: any, config?: AxiosRequestConfig) {
  const response = await axiosInstance.post<ResponseData>(url, data, config);
  return response.data.data;
}

export async function _put(url: string, data?: any, config?: AxiosRequestConfig) {
  const response = await axiosInstance.put<ResponseData>(url, data, config);
  return response.data.data;
}

export async function _delete(url: string, config?: AxiosRequestConfig) {
  const response = await axiosInstance.delete<ResponseData>(url, config);
  return response.data.data;
}

export {
  _get as get,
  _post as post,
  _put as put,
  _delete as delete
};
