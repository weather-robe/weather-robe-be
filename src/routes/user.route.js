import express from "express";
import {
  handleUserProfile,
  handleUpdateUserProfile,
  handleUpdateUserLocation,
} from "../controllers/user.controller.js";
import { verifyUserId } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.get("/:userId", verifyUserId, handleUserProfile);
route.patch("/:userId", verifyUserId, handleUpdateUserProfile);
route.patch("/:userId/location", verifyUserId, handleUpdateUserLocation);
export default route;
