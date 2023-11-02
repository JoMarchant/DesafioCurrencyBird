import axios from "axios";
import { TokenResponse, GeneralPayment } from "../interfaces";
import dotenv from "dotenv";

dotenv.config();

const MAX_RETRIES = 1;
const enviroment = process.env.NODE_ENV || "development";
let url: string;

if (enviroment === "production") {
  url = "https://prod.developers-test.currencybird.cl/";
} else {
  url = "https://dev.developers-test.currencybird.cl/";
}

const api = axios.create({ baseURL: url });

const getAuthorizationToken = async (email: string): Promise<TokenResponse> => {
  const response = await api.get("/token", { params: { email } });

  return { token: response.data!, status: response.status };
};

const makePayment = async (
  email: string,
  token: string,
  transferCode: string,
  amount: string,
): Promise<GeneralPayment | null> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await api.post(
        "/payment",
        { transferCode, amount },
        {
          headers: { Authorization: token },
          params: { email, transferCode },
        },
      );

      if (response.status !== 200) {
        throw new Error("Error making payment");
      }

      return response.data;
    } catch (error) {
      retries++;
    }
  }
  return null;
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
  if (response.status !== 200) {
    throw new Error("Error getting payment");
  }
  return response.data;
};

export default { getAuthorizationToken, makePayment, getPayment };
