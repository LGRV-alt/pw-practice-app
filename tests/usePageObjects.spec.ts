import { test, expect } from "@playwright/test";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutPage } from "../page-objects/formLayoutsPage";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  await navigateTo.formlayoutsPage();
  await navigateTo.datePickerPage();
  await navigateTo.smartTablePage();
  await navigateTo.toastrPage();
  await navigateTo.toolTipPage();
});

test("paramitized methods", async ({ page }) => {
  const navigateTo = new NavigationPage(page);
  const onFormLayoutsPage = new FormLayoutPage(page);
  await navigateTo.formlayoutsPage();
  await onFormLayoutsPage.SubmitUsingTheGridFormWithCredentialsAndSelectOption(
    "test@test.com",
    "Password1",
    "Option 1"
  );
});
