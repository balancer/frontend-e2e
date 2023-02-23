import { Page, Response } from 'playwright-core';
import { gotoPath } from '../helpers';

export default class PoolPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public goto(poolId): Promise<Response> {
    return gotoPath(`pool/${poolId}`, this.page);
  }

  public clickAddLiquidityLink(): Promise<void> {
    return this.page.getByRole('link', { name: /Add Liquidity/i }).click();
  }

  public clickWithdrawLink(): Promise<void> {
    return this.page.getByRole('link', { name: /Withdraw/i }).click();
  }

  public clickStakingMenu(): Promise<void> {
    return this.page.getByRole('button', { name: /Staking incentives/i }).click();
  }

  public openStakeModal(): Promise<void> {
    return this.page.getByRole('button', { name: /^Stake$/i }).click();
  }

  public openUnstakeModal(): Promise<void> {
    return this.page.getByRole('button', { name: /^Unstake$/i }).click();
  }
}
