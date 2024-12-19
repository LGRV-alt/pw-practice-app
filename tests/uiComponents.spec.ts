import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test.describe("Form Layouts page", () => {
  test.describe.configure({ retries: 2 });
  test.beforeEach(async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Form Layouts").click();
  });
  test("input fields", async ({ page }, testInfo) => {
    if (testInfo.retry) {
      // Do something
    }
    const usingTheGridEmailInput = page.locator("nb-card", { hasText: "Using the grid" }).getByRole("textbox", { name: "email" });
    await usingTheGridEmailInput.fill("test@test.com");
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially("test2@test.com");
    // Generic assertion
    const inputValue = await usingTheGridEmailInput.inputValue();
    expect(inputValue).toEqual("test2@test.com");

    // Locator assertion
    await expect(usingTheGridEmailInput).toHaveValue("test2@test.com");
  });

  test("radio buttons", async ({ page }) => {
    const usingTheGridForm = page.locator("nb-card", {
      hasText: "Using the grid",
    });

    // await usingTheGridForm.getByLabel("Option 1").check({ force: true });
    await usingTheGridForm.getByRole("radio", { name: "Option 1" }).check({ force: true });

    //   Making a generic assertion
    const radioStatus = await usingTheGridForm.getByRole("radio", { name: "Option 1" }).isChecked();
    expect(radioStatus).toBeTruthy();

    // Locator assertion
    await expect(usingTheGridForm.getByRole("radio", { name: "Option 1" })).toBeChecked();

    await usingTheGridForm.getByRole("radio", { name: "Option 2" }).check({ force: true });

    expect(await usingTheGridForm.getByRole("radio", { name: "Option 1" }).isChecked()).toBeFalsy();

    // This is a bit of a shortcut for the generic locators - you can pass the whole argument into the expect method rather than storing it elsewhere
    expect(await usingTheGridForm.getByRole("radio", { name: "Option 2" }).isChecked()).toBeTruthy();
  });
});

test("checkboxes", async ({ page }) => {
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Toastr").click();

  //   force: true needs to be added due to the Visually hidden property on the element
  //   Using the check method rather than the click method ensures the desiered outcome is always chosen
  // If the box is already checked then .check wont change that
  await page.getByRole("checkbox", { name: "Hide on click" }).uncheck({ force: true });
  await page.getByRole("checkbox", { name: "Prevent arising of duplicate toast" }).check({ force: true });

  const allBoxes = page.getByRole("checkbox");
  for (const box of await allBoxes.all()) {
    await box.uncheck({ force: true });
    expect(await box.isChecked()).toBeFalsy();
  }
});

test("Lists and dropdowns", async ({ page }) => {
  // Selecting the parent (ngx-header) then the child (nb-select)
  const dropDownMenu = page.locator("ngx-header nb-select");
  await dropDownMenu.click();

  //   selectors for dropdown items
  page.getByRole("list"); // when the list has a UL tag
  page.getByRole("listitem"); // when the list has LI tag

  //   const optionList = page.getByRole("list").locator("nb-option");
  const optionList = page.locator("nb-option-list nb-option");
  await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
  await optionList.filter({ hasText: "Cosmic" }).click();

  const header = page.locator("nb-layout-header");
  await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");

  //   Object will all the possible color options
  const colors = {
    Light: "rgb(255, 255, 255)",
    Dark: "rgb(34, 43, 69)",
    Cosmic: "rgb(50, 50, 89)",
    Corporate: "rgb(255, 255, 255)",
  };
  await dropDownMenu.click();
  for (const color in colors) {
    await optionList.filter({ hasText: color }).click();
    await expect(header).toHaveCSS("background-color", colors[color]);
    if (color != "Corporate") {
      await dropDownMenu.click();
    }
  }
});

test("tooltips", async ({ page }) => {
  /* There can be many issues  when trying to test tooltips, you may need to 
    freeze the page to inspect the DOM with debugging mode to grab the element as it 
    changes */
  await page.getByText("Modal & Overlays").click();
  await page.getByText("Tooltip").click();

  const toolTipCard = page.locator("nb-card", {
    hasText: "Tooltip Placements",
  });
  await toolTipCard.getByRole("button", { name: "Top" }).hover();

  page.getByRole("tooltip"); // if you have a role tooltip created

  const tooltip = await page.locator("nb-tooltip").textContent();
  expect(tooltip).toEqual("This is a tooltip");
});

test("dialog box", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  //   This is a listener added to the test, any dialog boxes that have the entered text will be accepeted
  page.on("dialog", (dialog) => {
    expect(dialog.message()).toEqual("Are you sure you want to delete?");
    dialog.accept();
  });

  //   Grabbing the first row and hitting the delete button
  await page.getByRole("table").locator("tr", { hasText: "mdo@gmail.com" }).locator(".nb-trash").click();

  // Checking the first row has been deleted
  await expect(page.locator("table tr").first()).not.toHaveText("mdo@gmail.com");
});

test("web tables", async ({ page }) => {
  await page.getByText("Tables & Data").click();
  await page.getByText("Smart Table").click();

  //1. Get the row by any text in this row
  const targetRow = page.getByRole("row", { name: "twitter@outlook.com" });
  await targetRow.locator(".nb-edit").click();
  // New locator as the element has changed from text to an input box
  await page.locator("input-editor").getByPlaceholder("Age").clear();
  await page.locator("input-editor").getByPlaceholder("Age").fill("27");
  await page.locator(".nb-checkmark").click();

  //2. get the row based on the value in the ID field
  await page.locator(".ng2-smart-pagination-nav").getByText("2").click();
  const targetRowByID = page.getByRole("row", { name: "11" }).filter({ has: page.locator("td").nth(1).getByText("11") });
  await targetRowByID.locator(".nb-edit").click();
  await page.locator("input-editor").getByPlaceholder("E-mail").clear();
  await page.locator("input-editor").getByPlaceholder("E-mail").fill("spencer@mail.com");
  await page.locator(".nb-checkmark").click();

  await expect(targetRowByID.locator("td").nth(5)).toHaveText("spencer@mail.com");

  //3. Test filter of the table
  const ages = ["20", "30", "40", "200"];

  for (let age of ages) {
    await page.locator("input-filter").getByPlaceholder("Age").clear();
    await page.locator("input-filter").getByPlaceholder("Age").fill(age);
    await page.waitForTimeout(500);
    const ageRows = page.locator("tbody tr");
    for (let row of await ageRows.all()) {
      const cellValue = await row.locator("td").last().textContent();
      if (age == "200") {
        expect(await page.getByRole("table").textContent()).toContain("No data found");
      } else {
        expect(cellValue).toEqual(age);
      }
    }
  }
});

test("datepicker", async ({ page }) => {
  await page.getByText("Forms").click();
  await page.getByText("Datepicker").click();

  const calandarInputField = page.getByPlaceholder("Form Picker");
  await calandarInputField.click();

  //   Takes the date method and creates a dynamic date to be tested and asserted
  let date = new Date();
  date.setDate(date.getDate() + 30);
  const expectedDate = date.getDate().toString();
  const expectedMonthShort = date.toLocaleString("En-us", { month: "short" });
  const expectedMonthLong = date.toLocaleString("En-us", { month: "long" });
  const expectedYear = date.getFullYear();
  const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

  let calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();

  const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;
  while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
    await page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']").click();
    calendarMonthAndYear = await page.locator("nb-calendar-view-mode").textContent();
  }

  await page.locator("[class='day-cell ng-star-inserted']").getByText(expectedDate, { exact: true }).click();
  await expect(calandarInputField).toHaveValue(dateToAssert);
});

test("Sliders", async ({ page }) => {
  // Upadate attribute
  //   const tempGauge = page.locator(
  //     "[tabtitle='Temperature'] ngx-temperature-dragger circle"
  //   );
  //   await tempGauge.evaluate((node) => {
  //     node.setAttribute("cx", "232.630");
  //     node.setAttribute("cy", "232.630");
  //   });
  //   await tempGauge.click();

  //   Mouse movement
  const tempBox = page.locator("[tabtitle='Temperature'] ngx-temperature-dragger");
  await tempBox.scrollIntoViewIfNeeded();

  const box = await tempBox.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 100, y);
  await page.mouse.move(x + 100, y + 100);
  await page.mouse.up();
  await expect(tempBox).toContainText("30");
});
