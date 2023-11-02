import { Request, Response, NextFunction } from "express";

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
