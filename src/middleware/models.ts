import { Request, Response, NextFunction } from "express";
import GeneralPayment from "../apis/GeneralPayment";
import prisma from "../prisma";

export const findOrCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.body.email;
    let currentUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!currentUser) {
      currentUser = await prisma.user.create({
        data: {
          email: email,
        },
      });
    }

    req.userId = currentUser.id;
  } catch (error) {
    res.status(500).send("Error al buscar/crear el usuario (interno)");
    return;
  }

  next();
};

export const checkIfPaymentExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body.transferCode) {
      res.status(400).send("El transferCode es requerido");
      return;
    }
    const paymentCount = await prisma.payment.count({
      where: { userId: req.userId, transferCode: req.body.transferCode },
    });

    if (paymentCount) {
      res.status(400).send("El usuario ya no puede utilizar este transferCode");
      return;
    }
  } catch (error) {
    res.status(500).send("Error al verificar si el pago existe (interno)");
    return;
  }

  try {
    const newPayment = await GeneralPayment.getPayment(
      req.token as string,
      req.body.email,
      req.body.transferCode,
    );
    if (!(typeof newPayment === "string")) {
      res.status(400).send("El usuario ya no puede utilizar este transferCode");
      return;
    }
  } catch (error) {
    res
      .status(500)
      .send("Error al verificar si el pago existe (sistema externo caido)");
    return;
  }

  next();
};
