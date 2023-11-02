import axios from "axios";
import axiosRetry from "axios-retry";
import { TokenResponse, GeneralPayment } from "../interfaces";
import dotenv from "dotenv";

dotenv.config();

const MAX_RETRIES = 3;
const enviroment = process.env.NODE_ENV || "development";
let url: string;

if (enviroment === "production") {
  url = "https://prod.developers-test.currencybird.cl/";
} else {
  url = "https://dev.developers-test.currencybird.cl/";
}

const api = axios.create({ baseURL: url });
// https://www.zenrows.com/blog/axios-retry#retry-on-error
axiosRetry(api, {
  retries: MAX_RETRIES,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 500
    );
  },
});

const getAuthorizationToken = async (email: string): Promise<TokenResponse> => {
  const response = await api.get("/token", {
    params: { email },
    validateStatus: (status) => status < 500,
  });

  return { token: response.data!, status: response.status };
};

const makePayment = async (
  email: string,
  token: string,
  transferCode: string,
  amount: string,
): Promise<GeneralPayment | null> => {
  try {
    const response = await api.post(
      "/payment",
      { transferCode, amount },
      {
        headers: { Authorization: token },
        params: { email, transferCode },
      },
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

const getPayment = async (
  token: string,
  email: string,
  transferCode: string,
): Promise<GeneralPayment | string> => {
  const response = await api.get("/payment", {
    params: { email, transferCode },
    headers: { Authorization: token },
  });

  return response.data;
};

export default { getAuthorizationToken, makePayment, getPayment };
