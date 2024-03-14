import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import useEventStore from '../store/eventStore';
import useUserStore from '../store/userStore';
import io from 'socket.io-client';

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500
}

// export const SERVER_URL = 'https://arete.demo.aretehealth.tech/prod/api/v1/';

export const SERVER_URL = 'http://localhost:3000/prod/api/v1/';
export const BACKEND_URL = 'http://localhost:5050';

// export const BACKEND_URL = 'https://arete.demo.aretehealth.tech';

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
  // 'Access-Control-Allow-Credentials': true,
  // 'X-Requested-With': 'XMLHttpRequest'
};

export const socket = io(BACKEND_URL, {
  withCredentials: false,
  rejectUnauthorized: false
}); //connecting to socket server
socket.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// We can use the following function to inject the JWT token through an interceptor
// We get the `accessToken` from the localStorage that we set when we authenticate

class ApiClient {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  injectToken(config: AxiosRequestConfig) {
    const user = useUserStore.getState().user;
    if (user && user.access) {
      config.headers!.Authorization = `Bearer ${user.access}`;
    }
    return config;
  }

  initHttp() {
    const http = axios.create({
      baseURL: SERVER_URL,
      headers
      // withCredentials: true,
    });
    /* @ts-ignore */
    http.interceptors.request.use(this.injectToken, (error) =>
      Promise.reject(error)
    );

    http.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        return this.handleError(response);
      }
    );

    this.instance = http;
    return http;
  }

  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }

  private errorSnackbarHandler(data: any) {
    // data.messages.map((item: any) => {
    //   console.log(item);
    //   useEventStore.setState({
    //     snacks: [
    //       ...useEventStore.getState().snacks,
    //       {
    //         message: item.message,
    //         type: 'error',
    //         id: useEventStore.getState().snacks.length
    //       }
    //     ]
    //   });
    // });
    useEventStore.setState({
      snacks: [
        ...useEventStore.getState().snacks,
        {
          message: data[0]
            ? data[0].msg + ' at ' + data[0].param
            : data.message,
          type: 'error',
          id: useEventStore.getState().snacks.length
        }
      ]
    });
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error: any) {
    const { status, data } = error;
    this.errorSnackbarHandler(data);
    switch (status) {
      case StatusCode.InternalServerError: {
        // Handle InternalServerError
        break;
      }
      case StatusCode.Forbidden: {
        // Handle Forbidden
        break;
      }
      case StatusCode.Unauthorized: {
        // Handle Unauthorized
        break;
      }
      case StatusCode.TooManyRequests: {
        // Handle TooManyRequests
        break;
      }
    }

    return Promise.reject(error);
  }
}

export const apiClient = new ApiClient();
