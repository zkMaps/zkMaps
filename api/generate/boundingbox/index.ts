import { Response } from 'express';
import path from 'path';
import { promisify } from 'util';
import fs, { writeFileSync } from 'fs';
import { IGeoFenceRequest } from './interface';
import generateBoundingBoxTemplate from './bounding_box_circuit_template';

const { exec } = require('child_process');

const execProm = promisify(exec);
const GENERATED_BUILD_PATH = './public/generated_dependencies';

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

async function generateCircuitDependencies(circuitName: string, geoFenceCoords: [number]) {
  // create circuit specific folder
  const GENERATED_BUILD_CIRCUIT_FOLDER_PATH = `${GENERATED_BUILD_PATH}/${circuitName}`;

  // generate circuit content
  const circuitFileContent = generateBoundingBoxTemplate(geoFenceCoords);

  // build dep folders
  await execProm(`mkdir -p ${GENERATED_BUILD_PATH}`);
  await execProm(`mkdir -p ${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}`);

  // save users circuit to <buildpath>/geofence_<timestamp>.circom
  writeFileSync(
    path.join(__dirname, '../../../', GENERATED_BUILD_PATH, circuitName, `${circuitName}.circom`),
    circuitFileContent,
  );

  // compile circuit (not generating .sym, .cpp version and r1cs constraints)
  await execProm(`circom "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}.circom" --wasm  -o "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}"`);

  return `${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}_js/${circuitName}.wasm`
}

// TODO:
// - save circuits to db with associated user
// - user management - use address as key to store circuit
// - add local cache to avoid re-compiling circuits and storage usage