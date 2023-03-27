import { Dappwright } from '@tenkeylabs/dappwright';
import { Locator, Page } from 'playwright-core';
import { expect, network } from '../fixtures/testFixtures';

export default class HeaderPage {
  private page: Page;
  private metamask: Dappwright;

  constructor(page: Page, metamask: Dappwright) {
    this.page = page;
    this.metamask = metamask;
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
    await this.metamask.page.bringToFront();

    await this.metamask.unlock(process.env.PASSWORD);
    this.page.bringToFront();

    // Wait for a moment for the page to load, to see if the wallet is connected automatically
    await this.page.waitForTimeout(1000);

    const loadingWalletButtonHidden = await this.getLoadingAccountButton().isHidden();
    const accountButtonHidden = await this.getAccountButton().isHidden();

    // Check if the wallet is not yet connected
    if (accountButtonHidden && loadingWalletButtonHidden) {
      await this.page.getByRole('button', { name: 'Connect wallet' }).first().click();

      await this.page.getByRole('button', { name: 'Metamask' }).click({ force: true });
      // Approve the connection when MetaMask pops up
      await this.metamask.approve();

      // Check the wallet button in nav
      expect(await this.getAccountButton()).toBeVisible();
    }

    const mismatchNetworkMessage = await this.getMismatchNetworkMessage();

    if (await mismatchNetworkMessage.isVisible()) {
      const hasNetwork = await this.metamask.hasNetwork(network.networkName);

      if (!hasNetwork) {
        await this.metamask.switchNetwork(network.networkName);
      } else if (network.networkName === 'polygon') {
        // Add Polygon network if not yet added
        await this.metamask.addNetwork(network);
      }

      // Switch to correct network
      await this.page.bringToFront();
      // Temporary fix to make the mismatch network message disappear
      await this.page.reload();
    }
    expect(await this.getMismatchNetworkMessage()).toBeHidden();
  }
}
