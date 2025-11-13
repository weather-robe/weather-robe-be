import express from "express";
import { handleSignUp, handleSignIn } from "../controllers/auth.controller.js";
const route = express.Router();

route.post("/signup", handleSignUp);
route.post("/signin", handleSignIn);

export default route;
