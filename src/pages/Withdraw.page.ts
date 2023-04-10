import { Page } from 'playwright-core';
import { expect } from '../fixtures/testFixtures';

export default class SwapPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async selectMaxWMatic() {
    await this.page.getByText(/all tokens/i).click();
    await this.page.getByText('WMATIC', { exact: true }).click();
    await this.page.getByRole('button', { name: /max/i }).click();
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
