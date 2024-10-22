import * as dotenv from "dotenv";
import Joi from "joi";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

const envSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid("development", "production").required(),
		PORT: Joi.number().default(3500),
		DATABASE_URL: Joi.string().required(),
		ACCESS_SECRET: Joi.string().required(),
		ACCESS_SECRET_EXPIRES_IN: Joi.string().required(),
		REFRESH_SECRET: Joi.string().required(),
		REFRESH_SECRET_EXPIRES_IN: Joi.string().required(),
	})
	.unknown();

const { value: envVars, error } = envSchema
	.prefs({ errors: { label: "key" } })
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

const config = {
	nodeEnv: envVars.NODE_ENV,
	port: envVars.PORT,
	databaseURL: envVars.DATABASE_URL,
	accessSecret: envVars.ACCESS_SECRET,
	accessSecretExpiresIn: envVars.ACCESS_SECRET_EXPIRES_IN,
	refreshSecret: envVars.REFRESH_SECRET,
	refreshSecretExpiresIn: envVars.REFRESH_SECRET_EXPIRES_IN,
};

export default config;
