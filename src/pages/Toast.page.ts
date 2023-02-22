import { expect } from '@playwright/test';
import { Locator, Page } from 'playwright-core';

interface TransactionToast {
  pending: Locator;
  confirmed: Locator;
}

export default class ToastPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getToast(name: string | RegExp) {
    const toast = this.page.getByRole('alert').last().getByText(name);
    return toast;
  }

  public async verifyToastVisibility(toast: Locator) {
    await toast.waitFor({
      state: 'visible',
      // Increase timeout while waiting for the Transaction to be confirmed
      timeout: 60000,
    });
    expect(toast).toBeVisible();
  }

  // Locators
  public get swapToast(): TransactionToast {
    return {
      pending: this.getToast(/Swap pending/i),
      confirmed: this.getToast(/Swap confirmed/i),
    };
  }

  public get addLiquidityToast(): TransactionToast {
    return {
      pending: this.getToast(/Add Liquidity pending/i),
      confirmed: this.getToast(/Add Liquidity confirmed/i),
    };
  }

  public get stakeToast(): TransactionToast {
    return {
      pending: this.getToast(/Stake pending/i),
      confirmed: this.getToast(/Stake confirmed/i),
    };
  }

  public get unstakeToast(): TransactionToast {
    return {
      pending: this.getToast(/Unstake pending/i),
      confirmed: this.getToast(/Unstake confirmed/i),
    };
  }

  public get withdrawToast(): TransactionToast {
    return {
      pending: this.getToast(/Withdraw pending/i),
      confirmed: this.getToast(/Withdraw confirmed/i),
    };
  }
}
