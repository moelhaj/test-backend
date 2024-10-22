// @ts-nocheck
import express from "express";
import catchAsync from "../../utils/catchAsync";
import { auth } from "../auth/auth.middleware";
import * as controller from "./files.controller";
import validate from "./files.validation";
import { upload } from "../../utils/uploadFiles";

const router = express.Router();

router.get("/", auth, catchAsync(controller.getAll));
router.post("/", auth, validate(), catchAsync(controller.create));
router.post("/upload", auth, upload.single("file"), controller.uploadFile);
router.put("/:id", auth, validate(), catchAsync(controller.update));

export default router;
