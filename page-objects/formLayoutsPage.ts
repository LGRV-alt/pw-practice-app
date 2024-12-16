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
