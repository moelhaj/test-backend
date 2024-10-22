import { Request, Response } from "express";
import * as services from "./files.services";

export const getAll = async (req: Request, res: Response) => {
	const userId = req.query.userId as string;
	const userFiles = await services.findByUserId(userId);
	return res.status(200).send(userFiles);
};

export const create = async (req: Request, res: Response) => {
	const file = await services.create(req.body);
	return res.status(201).send(file);
};

export const uploadFile = async (req: Request, res: Response) => {
	return res.status(201).send("File uploaded successfully");
};

export const update = async (req: Request, res: Response) => {
	const file = await services.update(req.params.id, req.body);
	return res.status(200).send(file);
};
