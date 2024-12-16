import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { NavigationPage } from "../page-objects/navigationPage";
import { FormLayoutPage } from "../page-objects/formLayoutsPage";
import { DatePickerPage } from "../page-objects/datePickerPage";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formlayoutsPage();
  await pm.navigateTo().datePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().toolTipPage();
});

test("paramitized methods", async ({ page }) => {
  const pm = new PageManager(page);

  await pm.navigateTo().formlayoutsPage();
  await pm.onFormLayoutPage().SubmitUsingTheGridFormWithCredentialsAndSelectOption("test@test.com", "Password1", "Option 1");
  await pm.onFormLayoutPage().SubmitInlineFormWithNameEmailAndCheckbox("Lewis", "test@test.com", false);
  await pm.navigateTo().datePickerPage();
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5);
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(10, 20);
});
