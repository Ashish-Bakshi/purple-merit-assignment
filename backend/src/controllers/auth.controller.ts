import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { signToken } from "../utils/jwt";

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60 * 1000
};

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export async function signup(req: Request, res: Response) {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword
    }
  });

  const token = signToken({ userId: user.id, role: user.role });

  res
    .cookie("token", token, cookieOptions)
    .status(201)
    .json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.status === "INACTIVE") {
    return res.status(403).json({ message: "Account inactive" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ userId: user.id, role: user.role });

  res
    .cookie("token", token, cookieOptions)
    .json({
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
}

export function logout(req: Request, res: Response) {
    res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: false
  });
  res.json({ message: "Logged out" });
}

export async function getProfile(req: AuthRequest, res: Response) {

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, fullName: true, email: true, role: true }
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
}