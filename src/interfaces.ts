export interface GeneralPayment {
  amount: string;
  email: string;
  retries: number;
  transferCode: string;
}

export interface TokenResponse {
  token: string;
  status: number;
}

declare module "express" {
  interface Request {
    token?: string;
    userId?: string;
  }
}
