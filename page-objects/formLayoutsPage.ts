import { Page } from "@playwright/test";

export class FormLayoutPage {
  private readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async SubmitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
    const usingTheGridForm = this.page.locator("nb-card", {
      hasText: "Using the grid",
    });
    await usingTheGridForm.getByRole("textbox", { name: "Email" }).fill(email);
    await usingTheGridForm.getByRole("textbox", { name: "Password" }).fill(password);
    await usingTheGridForm.getByRole("radio", { name: optionText }).check({ force: true });

    await usingTheGridForm.getByRole("button").click();
  }

  /**
   * This method will fill out the inline form with user details
   * @param name - should be first and last name
   * @param email - valid email for the test user
   * @param rememberMe - true of false if user session to be saved
   */
  async SubmitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
    const usingTheInlinForm = this.page.locator("nb-card", {
      hasText: "inline form",
    });
    await usingTheInlinForm.getByRole("textbox", { name: "Jane Doe" }).fill(name);
    await usingTheInlinForm.getByRole("textbox", { name: "Email" }).fill(email);
    if (rememberMe) {
      await usingTheInlinForm.getByRole("checkbox").check({ force: true });
    }
    await usingTheInlinForm.getByRole("button").click();
  }
}
