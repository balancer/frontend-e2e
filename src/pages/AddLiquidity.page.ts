import { Page } from 'playwright-core';
import { expect } from '../fixtures/testFixtures';

export default class SwapPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async typeToInput(symbol: string, amount: string): Promise<void> {
    // Wait for the page and form to load
    const form = await this.page.getByTestId('add-liquidity-form');

    // Type in the amount of ETH to add
    await form.getByLabel(`Amount of: ${symbol}`, { exact: false }).type(amount);
  }

  public clickPreviewButton(): Promise<void> {
    return this.page.getByRole('button', { name: /Preview/i }).click();
  }

  public async clickApproveButton(): Promise<void> {
    return this.page
      .getByRole('button', {
        name: /approve wmatic for adding liquidity/i,
      })
      .click();
  }

  public async clickAddLiquidity(): Promise<void> {
    return this.page
      .getByRole('button', {
        name: /Add liquidity/i,
      })
      .click();
  }

  public async clickConfirmButton(): Promise<void> {
    return this.page
      .getByRole('button', {
        name: /Confirm/i,
      })
      .click();
  }

  public async verifyConfirmButtonDisabled(): Promise<void> {
    expect(await this.page.getByRole('button', { name: /Confirming.../i })).toBeDisabled();
  }
}
