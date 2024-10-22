import fs from "fs";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import express, { Express } from "express";
import { Request, Response, NextFunction } from "express";
import config from "./config";
import routes from "./api";
import { auth } from "./api/auth/auth.middleware";

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

//serving files for authenticated user
app.get("/file/:filename", auth as express.RequestHandler, (req, res) => {
	const filename = req.params.filename;
	const filepath = path.join(__dirname, "/src/" + "/../../uploads/", filename);

	// Check if the file exists
	fs.access(filepath, fs.constants.F_OK, err => {
		if (err) {
			return res.status(404).send("File not found");
		}

		// Send the file to the authenticated user
		res.sendFile(filepath);
	});
});

app.use("/api/v1", routes);

// serving the frontend
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../client/build")));

	app.get("*", (req: Request, res: Response) =>
		res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"))
	);
} else {
	app.get("/", (req: Request, res: Response) => {
		res.send("Please set to production");
	});
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "500 Internal Server Error";
	res.status(statusCode).send(err);
	next();
});

app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
