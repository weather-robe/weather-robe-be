import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import HTTPS from "https";
import swaggerUiExpress from "swagger-ui-express";
import apiRoute from "./routes/index.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { stateHandler } from "./middlewares/state.middleware.js";
import { swaggerOptions } from "./configs/swagger.config.js";
import { corsOptions } from "./configs/cors.config.js";
import { swaggerHandler } from "./middlewares/swagger.middleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(stateHandler);

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(null, swaggerOptions)
);

app.get("/openapi.json", swaggerHandler);

app.use("/v1/api/", apiRoute);

app.use(errorHandler);

const isSSL = process.env.SSL_ENABLED === "true";

if (isSSL) {
  const option = {
    ca: fs.readFileSync(process.env.CA_PATH),
    key: fs
      .readFileSync(path.resolve(process.cwd(), process.env.KEY_PATH), "utf8")
      .toString(),
    cert: fs
      .readFileSync(path.resolve(process.cwd(), process.env.CERT_PATH), "utf8")
      .toString(),
  };

  const httpsServer = HTTPS.createServer(option, app);

  httpsServer.listen(port, () => {
    console.log(`[HTTPS+WS] Server is running on port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`[HTTP] Server is running on http://localhost:${port}`);
  });
}
