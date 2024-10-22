import express from "express";
import authRoutes from "./auth/auth.route";
import filesRoutes from "./files/files.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/files", filesRoutes);

export default router;
