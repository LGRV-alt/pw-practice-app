import { test, expect } from "@playwright/test";

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

  //   await page.getByTitle("IoT Dashboard").click();

  await page.getByTestId("SignIn").click();
});

test("locating child elements", async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page
    .locator("nb-card")
    .locator("nb-radio")
    .locator(':text-is("Option 2")')
    .click();

  await page
    .locator("nb-card")
    .getByRole("button", { name: "Sign in" })
    .first()
    .click();

  // Avoid this approach - Things can be changed on a page
  await page.locator("nb-card").nth(3).getByRole("button").click();
});

test("Locating parent elements", async ({ page }) => {
  // Will grab the nb card that contains the text - "using the grid", like a filter for the locator
  await page
    .locator("nb-card", { hasText: "Using the Grid" })
    .getByRole("textbox", { name: "Email" })
    .click();
  // This gets the card by filtering with page.locator for an element with an id of "inputEmail"
  await page
    .locator("nb-card", { has: page.locator("#inputEmail") })
    .getByRole("textbox", { name: "Email" })
    .click();
  // This uses a seperate and built in function called filter, takes the same arguments as the other methods but it is seperate
  await page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .getByRole("textbox", { name: "Email" })
    .click();
  // Using the filter function with page.locator to grab a css rule of a child element to target the parent
  await page
    .locator("nb-card")
    .filter({ has: page.locator(".status-danger") })
    .getByRole("textbox", { name: "Password" })
    .click();
  // Join filter together to get a single card, in this case - cards that contain checkboxes then filter the results for cards that contain the words "Sign in"
  await page
    .locator("nb-card")
    .filter({ has: page.locator("nb-checkbox") })
    .filter({ hasText: "Sign in" })
    .getByRole("textbox", { name: "Email" })
    .click();
  // Not ideal - Using the locator("..") this goes up one step to the parent (Bit like linux commands)
  await page
    .locator(":text-is('Using the Grid')")
    .locator("..")
    .getByRole("textbox", { name: "Email" })
    .click();
});

test("Reusing Locators", async ({ page }) => {
  // store the data thats copied often into a varible, easier to read and easier to reuse
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  await basicForm.getByRole("textbox", { name: "Password" }).fill("Welcome123");
  await basicForm.locator("nb-checkbox").click();
  await basicForm.getByRole("button").click();

  await expect(emailField).toHaveValue("test@test.com");
});

test("extracting values", async ({ page }) => {
  // Single text value
  const basicForm = page.locator("nb-card").filter({ hasText: "Basic form" });
  const buttonText = await basicForm.locator("button").textContent();
  expect(buttonText).toEqual("Submit");

  // All text values
  const allRadioButtonsLabels = await page
    .locator("nb-radio")
    .allTextContents();
  expect(allRadioButtonsLabels).toContain("Option 1");

  //   Input value
  const emailField = basicForm.getByRole("textbox", { name: "Email" });
  await emailField.fill("test@test.com");
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual("test@test.com");
  // Method to find the placeholder value
  const placeholderValue = await emailField.getAttribute("placeholder");
  expect(placeholderValue).toEqual("Email");
});

test("assertions", async ({ page }) => {
  // General assertions
  const value = 5;
  expect(value).toEqual(5);

  const basicFormButton = page
    .locator("nb-card")
    .filter({ hasText: "Basic form" })
    .locator("button");

  const text = await basicFormButton.textContent();
  expect(text).toEqual("Submit");

  //   Locator assertion
  await expect(basicFormButton).toHaveText("Submit");

  //   Soft assertion
  await expect.soft(basicFormButton).toHaveText("Submit5");
  await basicFormButton.click();
});
