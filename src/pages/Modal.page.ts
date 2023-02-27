import { Locator, Page } from 'playwright-core';

export default class ModalPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public get(): Locator {
    return this.page.getByRole('dialog');
  }
}
