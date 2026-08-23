import { configDotenv } from "dotenv";
configDotenv();

import connectDB from "../src/db";
import app from "../src/app";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  return (app as any)(req, res);
}