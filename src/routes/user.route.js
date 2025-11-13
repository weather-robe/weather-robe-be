import express from "express";
import { handleUserProfile } from "../controllers/user.controller.js";

const route = express.Router();

route.get("/:userId", handleUserProfile);

export default route;
