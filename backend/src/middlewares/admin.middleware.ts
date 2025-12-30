import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
}
