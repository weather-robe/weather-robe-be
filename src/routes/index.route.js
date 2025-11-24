import express from "express";
import aiRoute from "./ai.route.js";
import authRoute from "./auth.route.js";
import userRoute from "./user.route.js";
import weatherRoute from "./weather.route.js";
import calenderRoute from "./calender.route.js";
import { verifyUserId } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/user/:userId/calender", verifyUserId, calenderRoute);
router.use("/user/:userId/weather", verifyUserId, aiRoute);
router.use("/user/:userId/weather", verifyUserId, weatherRoute);

export default router;
