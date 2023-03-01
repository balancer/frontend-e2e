import { Page } from 'playwright-core';
import { gotoPath } from '../helpers';
import ModalPage from './Modal.page';

export default class SwapPage {
  private page: Page;
  private modal: ModalPage;

  constructor(page: Page) {
    this.page = page;
    this.modal = new ModalPage(page);
  }

  public goto() {
    return gotoPath('swap', this.page);
  }

  public typeToTokenOutInput(amount: string) {
    return this.page.getByLabel(/Token Out/i).type(amount);
  }

  public acceptHighPriceImpact() {
    return this.page.getByRole('button', { name: /Accept/i }).click({
      // Loading the swap preview can take a while on Goerli
      timeout: 20000,
    });
  }

  public showSwapPreview() {
    return this.page.getByRole('button', { name: /Preview/i }).click();
  }

  public clickConfirmSwap() {
    return this.modal
      .get()
      .getByRole('button', { name: /Confirm Swap/i })
      .click();
  }
}
