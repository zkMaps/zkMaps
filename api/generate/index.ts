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

  // compile circuit
  await execProm(`circom "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}.circom" --r1cs --wasm --sym --c -o "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}"`);

  // build witness
  await execProm(`node "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}_js/generate_witness.js" "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}_js/${circuitName}.wasm" "${GENERATED_BUILD_PATH}/../template_input.json" "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/witness.wtns"`);

  // create trusted setup
  // await execProm(`snarkjs groth16 setup "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}.r1cs" ${PTAU_PATH}/pot12_final.ptau "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}"`);
  // await execProm(`snarkjs zkey export verificationkey "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}/${circuitName}_0001.zkey" "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}/verification_key.json"`);
  // await execProm(`snarkjs groth16 prove "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}/${circuitName}_0001.zkey" "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}/witness.wtns" "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}/proof.json" "${GENERATED_BUILD_CIRCUIT_FOLDER_PATH}/${circuitName}/public.json"`);
}
// TODO:
// - save circuits to db with associated user
// - user management
