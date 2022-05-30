import { Request, Response } from "express";

export default async ({ body }: Request, res: Response) =>
  res.json({ message: "generate request", data: body });
