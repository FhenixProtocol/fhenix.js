// this is a cjs because jest sucks at typescript
import { killDockerContainerAsync } from './docker';

module.exports = async () => {
  if (process.env.SKIP_LOCAL_ENV === "true") {
    return;
  }
  console.log("\nWaiting for Fhenix to stop...");

  await killDockerContainerAsync();

  console.log("Stopped test container. Goodbye!");
};
