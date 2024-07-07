import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  BaseRequest,
  BaseResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../models";
import { useAppStore } from "./useAppStore";

export const HttpService = axios.create();

const refreshToken = (): Promise<string | undefined> => {
  return new Promise<string | undefined>((resolve) => {
    const state = useAppStore.getState();
    if (
      state.profile &&
      state.profile.user &&
      state.profile.token &&
      state.profile.tokenExpiration
    ) {
      if (new Date(state.profile.tokenExpiration) > new Date()) {
        resolve(state.profile.token);
      } else {
        const request: RefreshTokenRequest = {
          userName: state.profile.user.userName,
          token: state.profile.token,
        };
        const user = state.profile.user;

        axios
          .post<RefreshTokenResponse>("/api/user/refreshtoken", request)
          .then((response) => {
            if (response.data.error) {
              resolve(undefined);
            } else {
              useAppStore.setState({
                profile: {
                  user,
                  token: response.data.token!,
                  tokenExpiration: response.data.tokenExpiration!,
                },
              });
            }
            resolve(response.data.token!);
          })
          .catch(() => {
            return Promise.resolve(undefined);
          });
      }
    }
  });
};

const requestInterceptor: (
  config: InternalAxiosRequestConfig<BaseRequest>
) => Promise<InternalAxiosRequestConfig<BaseRequest>> = async (config) => {
  useAppStore.setState({ isLoading: true });
  const token = await refreshToken();
  config.headers.setAuthorization(`Bearer ${token}`);
  return config;
};

const responseInterceptor: (
  respponse: AxiosResponse<BaseResponse, BaseRequest>
) => AxiosResponse<BaseResponse> = (response) => {
  if (response.data.error?.code) {
    useAppStore.setState({
      isLoading: false,
      httpFailureMessage: response.data.error.code,
    });
    throw response.data.error.code;
  } else {
    const request = (
      response.config.data ? JSON.parse(`${response.config.data}`) : {}
    ) as BaseRequest;
    useAppStore.setState({
      isLoading: false,
      httpSuccessMessage: request?.successMessage,
    });
    return response;
  }
};
const errorInterceptor: (error: unknown) => unknown = (error) => {
  useAppStore.setState({ isLoading: false });
  throw error;
};

HttpService.interceptors.request.use(requestInterceptor, errorInterceptor);
HttpService.interceptors.response.use(responseInterceptor, errorInterceptor);
