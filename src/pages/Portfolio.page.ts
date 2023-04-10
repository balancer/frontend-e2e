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

  public findPoolWithWMatic() {
    return this.page.getByRole('button', { name: 'wMATIC' });
  }

  public hasBalanceInPoolWithWMatic(): Promise<boolean> {
    return this.findPoolWithWMatic().isVisible();
  }

  public goToPoolWithWMatic() {
    return this.findPoolWithWMatic().click();
  }
}
