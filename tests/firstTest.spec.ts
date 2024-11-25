import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
  await page.getByText("Forms").click();
  await page.getByText("Form Layouts").click();
});

test("Locator syntax rules", async ({ page }) => {
  // By Tag name
  await page.locator("input").first().click();

  // By ID
  await page.locator("#inputEmail").click();

  // By Class value
  page.locator(".shape-rectangle");

  // By attribute
  page.locator("[placeholder='Email'");

  // combine different selectors
  page.locator('input[placeholder="Email"]');
});

test("User facing locators", async ({ page }) => {
  await page.getByRole("textbox", { name: "Email" }).first().click();

  await page.getByRole("button", { name: "Sign in" }).first().click();

  await page.getByLabel("Email").first().click();

  await page.getByPlaceholder("Jane Doe").click();

  await page.getByText("PW-Test").click();

  await page.getByTitle("IoT Dashboard").click();

  await page.getByTestId("");
});
