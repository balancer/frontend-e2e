import {
  BrowserContext,
  Fixtures,
  Page,
  PlaywrightTestArgs,
  PlaywrightWorkerArgs,
  // eslint-disable-next-line no-restricted-imports
  test as testBase,
} from '@playwright/test';

import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright';
import ToastPage from '../pages/Toast.page';
import SwapPage from '../pages/Swap.page';
import HeaderPage from '../pages/Header.page';
import PoolPage from '../pages/Pool.page';
import AddLiquidityPage from '../pages/AddLiquidity.page';
import WithdrawPage from '../pages/Withdraw.page';

interface TestFixtures {
  context: BrowserContext;
  metamask: Dappwright;
  toast: ToastPage;
  swapPage: SwapPage;
  header: HeaderPage;
  poolPage: PoolPage;
  addLiquidityPage: AddLiquidityPage;
  withdrawPage: WithdrawPage;
  modal: ReturnType<typeof getModalFixture>;
}

const getModalFixture = (page: Page) => {
  return page.getByRole('dialog');
};

const testFixtures: Fixtures<TestFixtures, unknown, PlaywrightTestArgs, PlaywrightWorkerArgs> = {
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
  swapPage: async ({ page }, use) => {
    const swapPage = new SwapPage(page);
    await use(swapPage);
  },
  poolPage: async ({ page }, use) => {
    const poolPage = new PoolPage(page);
    await use(poolPage);
  },
  addLiquidityPage: async ({ page }, use) => {
    const addLiquidityPage = new AddLiquidityPage(page);
    await use(addLiquidityPage);
  },
  withdrawPage: async ({ page }, use) => {
    const withdrawPage = new WithdrawPage(page);
    await use(withdrawPage);
  },
  header: async ({ page, metamask }, use) => {
    const header = new HeaderPage(page, metamask);
    await use(header);
  },
  modal: async ({ page }, use) => {
    const toast = getModalFixture(page);
    await use(toast);
  },
};

export const test = testBase.extend<TestFixtures>(testFixtures);
export const expect = test.expect;

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
