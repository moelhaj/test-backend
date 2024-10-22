import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import express, { Express } from "express";
import { Request, Response, NextFunction } from "express";
import config from "./config";
import routes from "./api";

const app: Express = express();

app.use(morgan("tiny"));

app.use(
	cors({
		credentials: true,
		origin: true,
	})
);
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/v1", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "500 Internal Server Error";
	res.status(statusCode).send(err);
	next();
});

app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
