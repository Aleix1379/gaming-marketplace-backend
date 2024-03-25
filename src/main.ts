import "./shared/infrastructure/load-env-vars";

import bodyParser from "body-parser";
import express from "express";

import { config } from "./shared/infrastructure/config";
import db from "./shared/infrastructure/database/sequelize/models";
import { userRouter } from "./users/infrastructure/rest-api/user-router";

function bootstrap() {
  const app = express();

  app.use(bodyParser.json());
  app.use("/users", userRouter);

  if (!db.sequelize) {
    throw new Error("Sequelize instance not found");
  }

  db.sequelize
    .sync()
    .then(() => {
      const { port } = config.server;

      app.listen(port, () => {
        console.log(`[APP] - Starting application on port ${port}`);
      });
    })
    .catch((error: Error) => {
      console.error("Unable to connect to the database:", error);
    });
}

bootstrap();
