import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validate = () => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fileSchema = Joi.object({
				name: Joi.string().required(),
				url: Joi.string().required(),
				tags: Joi.array().items(Joi.string()).required(),
				type: Joi.string().required(),
				userId: Joi.string().required(),
			});
			const file = {
				name: req.body.name,
				url: req.body.url,
				tags: req.body.tags,
				type: req.body.type,
				userId: req.body.userId,
			};
			await fileSchema.validate(req.body);
			req.body = file;
			next();
		} catch (error) {
			console.log(error);
			return res.status(422).send("validation error");
		}
	};
};

export default validate;
