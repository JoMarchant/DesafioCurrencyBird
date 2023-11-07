import { Response, NextFunction, Request } from "express";
import GeneralPayment from "../apis/GeneralPayment";
import { TokenResponse } from "../interfaces";

export const checkAPIKey = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    console.log(req.headers);
    res.status(401).send("API Key requerida");
    return;
  }

  if (apiKey !== process.env.API_KEY) {
    res.status(401).send("API Key inválida");
    return;
  }

  next();
};

export const authGeneralPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const email = req.body.email;
  if (!email) {
    res.status(400).send("El email es requerido");
    return;
  }
  try {
    const response: TokenResponse =
      await GeneralPayment.getAuthorizationToken(email);
    if (response.status === 401) {
      res.status(401).send("Email no autorizado para realizar pagos");
      return;
    }

    req.token = response.token;
  } catch (e) {
    res.status(500).send("Algo salió mal al obtener el token de autenticación");
    return;
  }

  next();
};
