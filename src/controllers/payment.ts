import { Response, Request } from "express";
import GeneralPayment from "../apis/GeneralPayment";
import prisma from "../prisma";
import { Payment } from "../interfaces";
import { User } from "@prisma/client";

export const sendGeneralPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token: string = req.token!;
  const payment: Payment = req.body;

  let currentUser: User | null = await prisma.user.findUnique({
    where: {
      email: payment.email,
    },
  });

  if (!currentUser) {
    currentUser = await prisma.user.create({
      data: {
        email: payment.email,
      },
    });
  }

  const paymentCount = await prisma.payment.count({
    where: { userId: currentUser.id, transferCode: payment.transferCode },
  });

  if (paymentCount) {
    res.status(400).send("El usuario ya no puede utilizar este transferCode");
    return;
  }

  const paymentResponse = await GeneralPayment.makePayment(
    currentUser.email,
    token,
    payment,
  );

  if (paymentResponse) {
    await prisma.payment.create({
      data: {
        userId: currentUser.id,
        amount: payment.amount,
        transferCode: payment.transferCode,
      },
    });
    res.status(201).send(paymentResponse);
  } else {
    res.status(500).send("Error al realizar el pago (sistema externo caído)");
  }
};

export const getPaymentInfo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, transferCode } = req.query;
    const payment = await GeneralPayment.getPayment(
      email as string,
      transferCode as string,
    );
    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send("Error al obtener el pago");
  }
};
