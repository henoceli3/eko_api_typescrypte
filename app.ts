import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./router";
import dotenv from "dotenv";
// import { initDb } from "./src/db/sequelize";

dotenv.config();

const app: Express = express();

const port: number = Number(process.env.PORT) || 5000;

app.use(cors());

app.use(bodyParser.json());

// initDb();

app.use("/", router);

app.use((req: Request, res: Response, next: NextFunction) => {
  const message: string =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur: http://localhost:${port}`
  )
);

export default app;
