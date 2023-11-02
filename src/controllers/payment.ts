import { Response, Request } from "express";
import GeneralPayment from "../apis/GeneralPayment";
import prisma from "../prisma";

export const sendGeneralPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token: string = req.token!;
  const body = req.body;
  if (!body.amount) {
    res.status(400).send("El amount es requerido");
    return;
  }

  const paymentResponse = await GeneralPayment.makePayment(
    body.email,
    token,
    body.transferCode,
    body.amount,
  );

  if (!paymentResponse) {
    res.status(500).send("Error al realizar el pago (sistema externo caído)");
    return;
  }

  try {
    await prisma.payment.create({
      data: {
        userId: req.userId as string,
        amount: body.amount,
        transferCode: body.transferCode,
      },
    });
    res.status(201).send(paymentResponse);
  } catch (error) {
    res.status(500).send("Error al crear el pago (interno)");
  }
};

export const getPaymentInfo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, transferCode } = req.query;
    const token: string = req.token!;
    const payment = await GeneralPayment.getPayment(
      token,
      email as string,
      transferCode as string,
    );
    res.status(200).send(payment);
  } catch (error) {
    res.status(500).send("Error al obtener el pago (sistema externo caído)");
  }
};
