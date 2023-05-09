import { Page } from 'playwright-core';
import { expect } from '../fixtures/testFixtures';

export default class SwapPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async selectMaxWMatic() {
    // Withdraw all to WMatic
    await this.page.getByText(/single token/i).click();
    const maxButtonName = /^Max.*Max?/i;
    await this.page.getByRole('button', { name: maxButtonName }).click();
  }

  public clickPreviewButton(): Promise<void> {
    return this.page.getByRole('button', { name: /Preview/i }).click();
  }

  public clickConfirmButton(): Promise<void> {
    return this.page.getByRole('button', { name: /Withdraw/i }).click();
  }

  public async verifyConfirmButtonDisabled(): Promise<void> {
    expect(await this.page.getByRole('button', { name: /Confirming.../i })).toBeDisabled();
  }
}
