/* eslint-disable prettier/prettier */

import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;

  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  NATS_SERVERS: string[];
}
const envSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  stripe_secret_key: envVars.STRIPE_SECRET_KEY,
  stripe_success_url: envVars.STRIPE_SUCCESS_URL,
  stripe_cancel_url: envVars.STRIPE_CANCEL_URL,
  natsServers: envVars.NATS_SERVERS,
};
