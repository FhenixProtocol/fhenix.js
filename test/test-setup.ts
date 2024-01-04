import { waitForChainToStart } from "./utils";
import { killDockerContainerAsync, runDockerContainerAsync } from './docker';

const TEST_ENDPOINT_URL = process.env.TEST_ENDPOINT || "http://localhost:8545"

export const setup = async () => {
  if (process.env.SKIP_LOCAL_ENV === "true") {
    return;
  }

  runDockerContainerAsync();

  console.log("\nWaiting for Fhenix to start...");

  await waitForChainToStart(TEST_ENDPOINT_URL);

  console.log("Fhenix is running!");
};

// this is a cjs because jest sucks at typescript

export const teardown = async () => {
  if (process.env.SKIP_LOCAL_ENV === "true") {
    return;
  }
  console.log("\nWaiting for Fhenix to stop...");

  await killDockerContainerAsync();

  console.log("Stopped test container. Goodbye!");
};

