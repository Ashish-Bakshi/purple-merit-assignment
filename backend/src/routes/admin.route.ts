import { Router } from "express";
import {
  listUsers,
  activateUser,
  deactivateUser
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", listUsers);
router.patch("/users/:id/activate", activateUser);
router.patch("/users/:id/deactivate", deactivateUser);

export default router;
