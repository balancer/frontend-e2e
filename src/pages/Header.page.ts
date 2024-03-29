import { Dappwright } from '@tenkeylabs/dappwright';
import { Locator, Page } from 'playwright-core';
import { expect } from '../fixtures/testFixtures';
import { gotoPath } from '../helpers';

export default class HeaderPage {
  private page: Page;
  private metamask: Dappwright;

  constructor(page: Page, metamask: Dappwright) {
    this.page = page;
    this.metamask = metamask;
  }

  public async goToMainPage() {
    return gotoPath('', this.page);
  }

  public getAccountButton = () =>
    this.page.getByRole('button', {
      name:
        // Truncated account eg. 0x1234...1234
        /0x.{4}(...).{4}/i,
    });

  public getLoadingAccountButton = () =>
    this.page.getByRole('button', {
      name: /Connecting.../i,
    });

  public getMismatchNetworkMessage = (): Locator => {
    return this.page.getByRole('alert').getByText(/Please switch to /i);
  };

  public async connectWallet() {
    this.page.bringToFront();

    // Wait for a moment for the page to load, to see if the wallet is connected automatically
    await this.page.waitForTimeout(1000);

    const loadingWalletButtonHidden = await this.getLoadingAccountButton().isHidden();
    const accountButtonHidden = await this.getAccountButton().isHidden();

    // Check if the wallet is not yet connected
    if (accountButtonHidden && loadingWalletButtonHidden) {
      await this.page.getByRole('button', { name: 'Connect wallet' }).first().click();

      // Check "Accept Terms of Use"
      await this.page.getByRole('radio').click();
      await this.page.getByRole('button', { name: 'Metamask' }).click({ force: true });
      // Approve the connection when MetaMask pops up
      await this.metamask.approve();

      // Check the wallet button in nav
      expect(await this.getAccountButton()).toBeVisible();
    }
  }
}
