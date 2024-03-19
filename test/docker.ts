import util from "util";

const execPromise = util.promisify(require("child_process").exec);
export const CONTAINER_NAME = "fhenixjs-test-env";

// Function to run a Docker container using the 'execPromise' function
export async function runDockerContainerAsync() {
  const imageName = "ghcr.io/fhenixprotocol/localfhenix:v0.2.0-beta0";

  const ports = "-p 8545:8547 -p 5000:3000";

  const removePrevious = `docker kill ${CONTAINER_NAME}`;

  const command = `docker run --rm --name ${CONTAINER_NAME} ${ports} -d ${imageName}`;

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
