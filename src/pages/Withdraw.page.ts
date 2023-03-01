import { Locator, Page } from 'playwright-core';
import { expect } from '../fixtures/testFixtures';
import { network } from '../fixtures/testFixtures';
import { gotoPath } from '../helpers';

export default class SwapPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
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
