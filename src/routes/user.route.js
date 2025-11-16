import express from "express";
import { handleUserProfile } from "../controllers/user.controller.js";
import { verifyUserId } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.get("/:userId", verifyUserId, handleUserProfile);

export default route;
