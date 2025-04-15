import axios from "axios";

const onRequest = (config) => {
  const state = "store.getState()";
  // const token = `Bearer ${state.auth.user?.data?.token}`;
  const token = null;

  if (token && config.headers) {
    config.headers.Authorization = token;
  }

  return config;
};

const onRequestError = (error) => {
  console.error(`[request error] [${JSON?.stringify?.(error)}]`);
  return Promise.reject(error);
};

const onResponse = (response) => {
  // console.info(`[response] [${JSON?.stringify?.(response)}]`);
  if (response.data) return response.data;
  return response.data;
};

const onResponseError = (error) => {
  console.error(`[response error] [${JSON?.stringify?.(error)}]`);
  return Promise.reject(error);
};

function setupInterceptorsTo(axiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

export const fetchApi = setupInterceptorsTo(
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      key: import.meta.env.VITE_API_KEY,
    },
  })
);
