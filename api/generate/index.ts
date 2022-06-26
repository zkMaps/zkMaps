import { Response } from 'express';
import path from 'path';
import { promisify } from 'util';
import { writeFileSync } from 'fs';
import { IGeoFenceRequest } from './interface';
import generateTemplate from './circuit_template';

const { exec } = require('child_process');

const execProm = promisify(exec);
const GENERATED_BUILD_PATH = './public/generated_dependencies';
const PTAU_PATH = './public/ptau';

export default async ({ body }: IGeoFenceRequest, res: Response) => {
  try {
    const { geoFenceCoords } = body;
    const circuitName = `geofence_${Date.now()}`;

    await generateCircuitDependencies(circuitName, geoFenceCoords);
    res.json({ message: 'generate request', circuitName });
  } catch (error) {
    res.status(500).send({ error });
  }
};

async function generateCircuitDependencies(circuitName: string, geoFenceCoords: [number]) {
  // create circuit specific folder
  const GENERATED_BUILD_CIRCUIT_FOLDER_PATH = `${GENERATED_BUILD_PATH}/${circuitName}`;

  // generate circuit content
  const circuitFileContent = generateTemplate(geoFenceCoords);

  // build dep folders
  await execProm(`mkdir -p ${GENERATED_BUILD_PATH}`);
  await execProm(`mkdir -p ${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}`);

  // save users circuit to <buildpath>/geofence_<timestamp>.circom
  writeFileSync(
    path.join(__dirname, '../../', GENERATED_BUILD_PATH, circuitName, `${circuitName}.circom`),
    circuitFileContent,
  );

  // compile circuit (not generating .sym, .cpp version)
  await execProm(`circom "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}.circom" --r1cs --wasm  -o "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}"`);
  
  // [PR❗]: should we generate and delete the files, since 
}

// TODO:
// - save circuits to db with associated user
// - user management - use address as key to store circuit
