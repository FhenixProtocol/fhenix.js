import { waitForChainToStart } from "./utils";
import { runDockerContainerAsync } from './docker';

require("ts-node").register({ transpileOnly: true });

const TEST_ENDPOINT_URL = process.env.TEST_ENDPOINT || "http://localhost:8545"

module.exports = async () => {
  if (process.env.SKIP_LOCAL_ENV === "true") {
    return;
  }

  runDockerContainerAsync();

  console.log("\nWaiting for Fhenix to start...");

  await waitForChainToStart(TEST_ENDPOINT_URL);

  console.log("Fhenix is running!");
};
