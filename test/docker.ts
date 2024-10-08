/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty */
import util from "util";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const execPromise = util.promisify(require("child_process").exec);
export const CONTAINER_NAME = "fhenixjs-test-env";

// Function to run a Docker container using the 'execPromise' function
export async function runDockerContainerAsync() {
  const imageName = "ghcr.io/fhenixprotocol/nitro/localfhenix:v0.3.0-alpha.1";

  const ports = "-p 8545:8547 -p 5000:3000";

  const removePrevious = `docker kill ${CONTAINER_NAME}`;

  const command = `docker run --rm --env FHEOS_SECURITY_ZONES=2 --name ${CONTAINER_NAME} ${ports} -d ${imageName}`;

  try {
    try {
      await execPromise(removePrevious);
    } catch (_) {}
    const result = await execPromise(command);
    // console.log(result.stdout);
    // console.error(result.stderr);
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Failed to start docker container");
  }
}

export async function killDockerContainerAsync() {
  const removePrevious = `docker kill ${CONTAINER_NAME}`;

  try {
    await execPromise(removePrevious);
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Failed to remove docker container");
  }
}
