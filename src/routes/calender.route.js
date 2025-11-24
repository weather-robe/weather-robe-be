import express from "express";
import {
  handleGetCalender,
  handleGetCalenderDetail,
} from "../controllers/calender.controller.js";

const route = express.Router();

route.get("/", handleGetCalender);
route.get("/detail", handleGetCalenderDetail);
export default route;
