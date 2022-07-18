import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { readFileSync } from 'fs';

export default async (_, res: Response) => {
  try {
    res.setHeader("content-type", "application/octet-stream");
    fs.createReadStream('./public/bounding_box_template.zkey')
      .pipe(res);
  } catch (error) {
    res.status(500).send({ error });
  }
};

// TODO:
// - consolidate requests (serve multiple files)