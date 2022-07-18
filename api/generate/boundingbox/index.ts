import { Response } from 'express';
import fs from 'fs';
import generateCircuitDependencies from './generateCircuitDependencies';
import { IGeoFenceRequest } from './interface';

export default async ({ body }: IGeoFenceRequest, res: Response) => {
  try {
    const { geoFenceCoords } = body;
    const circuitName = `boundingbox_${Date.now()}`;

    // return compiled wasm circuit
    const wasmPath = await generateCircuitDependencies(circuitName, geoFenceCoords);
    res.setHeader("content-type", "application/octet-stream");
    fs.createReadStream(wasmPath)
      .pipe(res);

  } catch (error) {
    res.status(500).send({ error });
  }
};
