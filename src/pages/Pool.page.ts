import { Page, Response } from 'playwright-core';
import { gotoPath } from '../helpers';
import ModalPage from './Modal.page';

export default class PoolPage {
  private page: Page;
  private modal: ModalPage;

  constructor(page: Page) {
    this.page = page;
    this.modal = new ModalPage(page);
    this.page.bringToFront();
  }

  public goto(poolId): Promise<Response | null> {
    return gotoPath(`pool/${poolId}`, this.page);
  }

  public clickPoolWithStMatic(): Promise<void> {
    return this.page
      .getByRole('row', { name: /WMATIC stMATIC/i })
      .getByRole('button', { name: 'stMATIC' })
      .click();
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

  public confirmStake(): Promise<void> {
    // Click the stake button from modal
    return this.modal.get().getByRole('button', { name: /Stake/i }).click();
  }

  public confirmUnstake(): Promise<void> {
    // Click the Unstake button from modal
    return this.modal
      .get()
      .getByRole('button', { name: /Unstake/i })
      .click();
  }

  public openUnstakeModal(): Promise<void> {
    return this.page.getByRole('button', { name: /^Unstake$/i }).click();
  }
}
