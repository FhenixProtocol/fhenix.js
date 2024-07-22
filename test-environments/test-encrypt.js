const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

async function loginTest() {
  // Launch the browser
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Open the webpage
    await driver.get("http://localhost:3000/");

    // Wait for the .getencrypt element to be located and visible (max 10 seconds)
    let getEncryptButton = await driver.wait(until.elementLocated(By.className("getencrypt")), 10000);
    await driver.wait(until.elementIsVisible(getEncryptButton), 10000);

    // Click on the .getencrypt element
    await getEncryptButton.click();

    // Wait for the .encrypt element to be located, visible, and enabled (max 10 seconds)
    let encryptValue = await driver.wait(until.elementLocated(By.className("encrypted")), 10000);
    await driver.wait(until.elementIsVisible(encryptValue), 10000);

    // Continue with your logic here, e.g.,
    // await encryptButton.click(); // if you want to click on the encrypt button

  } catch (error) {
    console.error(`An error occurred: ${error}`);
  } finally {
    // Quit the browser
    await driver.quit();
  }
}

// Run the test
loginTest();
