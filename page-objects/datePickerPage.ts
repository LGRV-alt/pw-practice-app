import { Page, expect } from "@playwright/test";

export class DatePickerPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
    const calandarInputField = this.page.getByPlaceholder("Form Picker");
    await calandarInputField.click();

    const dateToAssert = await this.selectDateInTheCalandar(numberOfDaysFromToday);

    await expect(calandarInputField).toHaveValue(dateToAssert);
  }

  async selectDatePickerWithRangeFromToday(startDatFromToday: number, dayFromToday: number) {
    const calandarInputField = this.page.getByPlaceholder("Range Picker");
    await calandarInputField.click();
    const dateToAssertStart = await this.selectDateInTheCalandar(startDatFromToday);
    const dateToAssertEnd = await this.selectDateInTheCalandar(dayFromToday);

    const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`;
    await expect(calandarInputField).toHaveValue(dateToAssert);
  }

  private async selectDateInTheCalandar(numberOfDaysFromToday: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDaysFromToday);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString("En-us", { month: "short" });
    const expectedMonthLong = date.toLocaleString("En-us", { month: "long" });
    const expectedYear = date.getFullYear();
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();

    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`;
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
      await this.page.locator("nb-calendar-pageable-navigation [data-name='chevron-right']").click();
      calendarMonthAndYear = await this.page.locator("nb-calendar-view-mode").textContent();
    }
    await this.page.locator(".day-cell.ng-star-inserted").getByText(expectedDate, { exact: true }).click();
    return dateToAssert;
  }
}
