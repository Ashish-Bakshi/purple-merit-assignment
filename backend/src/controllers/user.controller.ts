import { Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function getProfile(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  });

  res.json(user);
}

export async function updateProfile(req: AuthRequest, res: Response) {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: "Full name and email required" });
  }

  const existing = await prisma.user.findFirst({
    where: {
      email,
      NOT: { id: req.user!.userId }
    }
  });

  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const updated = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { fullName, email }
  });

  res.json({
    message: "Profile updated",
    user: {
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      role: updated.role
    }
  });
}

export async function changePassword(req: AuthRequest, res: Response) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId }
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Incorrect current password" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed }
  });

  res.json({ message: "Password changed successfully" });
}
