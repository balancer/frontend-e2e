import {
  BrowserContext,
  expect,
  Fixtures,
  Page,
  PlaywrightTestArgs,
  PlaywrightWorkerArgs,
  test as base,
} from '@playwright/test';

import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright';
import ToastPage from '../pages/Toast.page';

interface TestFixtures {
  context: BrowserContext;
  metamask: Dappwright;
  toast: ToastPage;
  modal: ReturnType<typeof getModalFixture>;
}

const getModalFixture = (page: Page) => {
  return page.getByRole('dialog');
};

const testFixtures: Fixtures<
  TestFixtures,
  unknown,
  PlaywrightTestArgs,
  PlaywrightWorkerArgs
> = {
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    // Launch context with the same session from global-setup
    const { browserContext } = await dappwright.launch('', {
      version: MetaMaskWallet.recommendedVersion,
      wallet: 'metamask',
    });

    await use(browserContext);
    await browserContext.close();
  },
  metamask: async ({ context }, use) => {
    const metamask = await dappwright.getWallet('metamask', context);

    await use(metamask);
    // Unlock the wallet
    // await metamask.unlock();
  },
  toast: async ({ page }, use) => {
    const toast = new ToastPage(page);
    await use(toast);
  },
  modal: async ({ page }, use) => {
    const toast = getModalFixture(page);
    await use(toast);
  },
};

export const test = base.extend<TestFixtures>(testFixtures);

// If one of the tests fails, all subsequent tests are skipped. All tests in the group are retried together.
test.describe.configure({ mode: 'serial' });

// Goerli
export const network = {
  networkName: 'goerli',
  rpc: 'https://goerli.blockpi.network/v1/rpc/public',
  chainId: 5,
  symbol: 'ETH',
};

// Polygon
// const network = {
//   networkName: 'polygon',
//   rpc: 'https://polygon-rpc.com',
//   chainId: 137,
//   symbol: 'Matic',
// };

export async function connectWallet(page: Page, metamask: Dappwright) {
  const getAccountButton = () =>
    page.getByRole('button', {
      name:
        // Eg. 0x1234...1234
        /0x.{4}(...).{4}/i,
    });
  const getLoadingAccountButton = () =>
    page.getByRole('button', {
      name: /Connecting.../i,
    });
  const getMismatchNetworkMessage = () => page.getByText(/Please switch to /i);

  await page.goto('http://localhost:8080/#/' + network.networkName, {
    timeout: 30000,
  });

  await metamask.page.bringToFront();

  await metamask.unlock('testingbal123');
  page.bringToFront();

  // Wait for a moment for the page to load, to see if the wallet is connected automatically
  await page.waitForTimeout(1000);

  const loadingWalletButtonHidden = await getLoadingAccountButton().isHidden();
  const accountButtonHidden = await getAccountButton().isHidden();

  // Check if the wallet is not yet connected
  if (accountButtonHidden && loadingWalletButtonHidden) {
    await page.getByRole('button', { name: 'Connect wallet' }).first().click();

    await page.getByRole('button', { name: 'Metamask' }).click({ force: true });
    // Approve the connection when MetaMask pops up
    await metamask.approve();

    // // Wait for the dapp to redirect
    // await page.waitForURL('http://localhost:8080/#/' + network.networkName);

    // Check the wallet button in nav
    expect(await getAccountButton()).toBeVisible();
  }

  if (await getMismatchNetworkMessage().isVisible()) {
    const hasNetwork = await metamask.hasNetwork(network.networkName);

    if (!hasNetwork) {
      await metamask.switchNetwork(network.networkName);
    } else if (network.networkName === 'polygon') {
      // Add Polygon network if not yet added
      await metamask.addNetwork(network);
    }

    // Switch to correct network
    await page.bringToFront();
    // Temporary fix to make the mismatch network message disappear
    await page.reload();
  }
  expect(await getMismatchNetworkMessage()).toBeHidden();
}
