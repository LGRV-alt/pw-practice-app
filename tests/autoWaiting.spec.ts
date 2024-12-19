import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://uitestingplayground.com/ajax");
  await page.getByText("Button Triggering AJAX Request").click();
});

test("auto waiting", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  await successButton.click();

  //   const text = await successButton.textContent();

  //   Below will fail as it does not have autowait as standard
  //   This line makes sure that the program waits for the button to be attached
  //   await successButton.waitFor({ state: "attached" });
  //   const text = await successButton.allTextContents();
  //   expect(text).toContain("Data loaded with AJAX get request.");

  //   attach a value for waiting onto the line, this is 20 seconds although the button will appear in 15
  await expect(successButton).toHaveText("Data loaded with AJAX get request.", {
    timeout: 20000,
  });
});

test.skip("Alternative Waits", async ({ page }) => {
  const successButton = page.locator(".bg-success");

  //___ wait for element - Will stick to this line till the element given appears on the page
  //   await page.waitForSelector(".bg-success");

  //___ wait for particular response - waits for an api resonse before carrying on
  //   await page.waitForResponse("http://uitestingplayground.com/ajaxdata");

  //___ wait for network calls to be completed ("NOT RECOMMENDED")
  //   This will wait till there is no network calls, not recommened as it will wait for calls that might not effect anything
  await page.waitForLoadState("networkidle");

  const text = await successButton.allTextContents();
  expect(text).toContain("Data loaded with AJAX get request.");
});

test.skip("timeouts", async ({ page }) => {
  // This will increase the time of the test by 3
  test.slow();
  // By default, this should pass - timeout set to 30sec by default
  const successButton = page.locator(".bg-success");
  await successButton.click();
});
