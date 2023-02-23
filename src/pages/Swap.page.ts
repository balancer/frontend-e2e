import { Locator, Page } from 'playwright-core';
import { expect } from '../fixtures/testFixtures';
import { network } from '../fixtures/testFixtures';
import { gotoPath } from '../helpers';

export default class SwapPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public goto() {
    return gotoPath('swap', this.page);
  }

  public typeToTokenOutInput(amount: string) {
    return this.page.getByLabel(/Token Out/i).type(amount);
  }

  public acceptHighPriceImpact() {
    return this.page.getByRole('button', { name: /Accept/i }).click();
  }

  public openPreviewModal() {
    return this.page.getByRole('button', { name: /Preview/i }).click();
  }

  public confirmSwap() {
    return this.page.getByRole('button', { name: /Confirm Swap/i }).click();
  }
}
