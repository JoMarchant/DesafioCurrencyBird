import axios from "axios";
import { Payment, TokenResponse, GeneralPayment } from "../interfaces";

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
  payment: Payment,
): Promise<GeneralPayment | null> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await api.post("/payment", payment, {
        headers: { Authorization: token },
        params: { email, transferCode: payment.transferCode },
      });

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
  email: string,
  transferCode: string,
): Promise<GeneralPayment> => {
  const response = await api.get("/payment", {
    params: { email, transferCode },
  });
  if (response.status !== 200) {
    throw new Error("Error getting payment");
  }
  return response.data;
};

export default { getAuthorizationToken, makePayment, getPayment };
