import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function listUsers(req: Request, res: Response) {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.user.count()
  ]);

  res.json({
    data: users,
    page,
    totalPages: Math.ceil(total / limit),
    totalUsers: total
  });
}

export async function activateUser(req: Request, res: Response) {
  const { id } = req.params;

  await prisma.user.update({
    where: { id },
    data: { status: "ACTIVE" }
  });

  res.json({ message: "User activated" });
}

export async function deactivateUser(req: Request, res: Response) {
  const { id } = req.params;

  await prisma.user.update({
    where: { id },
    data: { status: "INACTIVE" }
  });

  res.json({ message: "User deactivated" });
}

