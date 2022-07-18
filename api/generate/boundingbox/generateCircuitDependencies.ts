import path from 'path';
import { promisify } from 'util';
import { writeFileSync } from 'fs';
import { exec } from 'child_process';
import generateBoundingBoxTemplate from './bounding_box_circuit_template';

export default async function generateCircuitDependencies(circuitName: string, geoFenceCoords: [number]) {

  const execProm = promisify(exec);
  
  // create circuit specific folder
  const GENERATED_BUILD_PATH = './public/generated_dependencies';
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
