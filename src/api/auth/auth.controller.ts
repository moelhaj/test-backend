import { Request, Response } from "express";
import * as services from "../users/users.services";
import jwt from "jsonwebtoken";
import config from "../../config";
import { hash, compare } from "bcryptjs";

type JwtPayload = {
	id: string;
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	console.log(email, password);
	const user = await services.findByEmail(email);
	if (!user || !(await compare(password, user.password)))
		return res.status(400).send("Wrong Credentials");

	const accessToken = jwt.sign({ id: user.id }, config.accessSecret, {
		expiresIn: config.accessSecretExpiresIn,
	});

	const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
		expiresIn: config.refreshSecretExpiresIn,
	});

	return res.status(200).send({ user, accessToken, refreshToken });
};

export const register = async (req: Request, res: Response) => {
	const { email, password, name } = req.body;
	const isUserExist = await services.findByEmail(email);
	if (isUserExist) return res.status(400).send("User already exist");
	const hashedPassword = await hash(password, 10);
	const user = await services.create({ email, password: hashedPassword, name });

	const accessToken = jwt.sign({ id: user.id }, config.accessSecret, {
		expiresIn: config.accessSecretExpiresIn,
	});

	const refreshToken = jwt.sign({ id: user.id }, config.refreshSecret, {
		expiresIn: config.refreshSecretExpiresIn,
	});

	return res.status(201).send({ user, accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
	try {
		const { refreshToken } = req.body;
		const decoded = jwt.verify(refreshToken, config.refreshSecret) as JwtPayload;
		const user = await services.findById(decoded.id);
		if (!user) return res.status(400).send("User not found");
		const accessToken = jwt.sign({ id: user.id }, config.accessSecret, {
			expiresIn: config.accessSecretExpiresIn,
		});
		return res.status(200).send({ accessToken });
	} catch (error) {
		return res.status(403).send("Forbidden");
	}
};
