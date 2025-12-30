import express  from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route'
import adminRoutes from './routes/admin.route'
import userRoutes from './routes/user.route'

const app = express();

app.use(cors({
  origin: process.env.Client_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

export default app;