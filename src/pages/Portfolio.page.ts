import { Page, Response } from 'playwright-core';
import { gotoPath } from '../helpers';

export default class PortfolioPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.page.bringToFront();
  }

  public goto(): Promise<Response | null> {
    return gotoPath('portfolio', this.page);
  }

  public findPoolWithStMatic() {
    return this.page.getByRole('button', { name: 'stMATIC' });
  }

  public hasBalanceInPoolWithStMatic(): Promise<boolean> {
    return this.findPoolWithStMatic().isVisible();
  }

  public goToPoolWithStMatic() {
    return this.findPoolWithStMatic().click();
  }
}
