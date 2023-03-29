import {
  BrowserContext,
  Fixtures,
  PlaywrightTestArgs,
  PlaywrightWorkerArgs,
  // eslint-disable-next-line no-restricted-imports
  test as testBase,
} from '@playwright/test';

import dappwright, { Dappwright } from '@tenkeylabs/dappwright';
import ToastPage from '../pages/Toast.page';
import SwapPage from '../pages/Swap.page';
import HeaderPage from '../pages/Header.page';
import PoolPage from '../pages/Pool.page';
import AddLiquidityPage from '../pages/AddLiquidity.page';
import WithdrawPage from '../pages/Withdraw.page';
import ModalPage from '../pages/Modal.page';
import PortfolioPage from '../pages/Portfolio.page';
import { metamaskVersion } from '../global-setup';

interface TestFixtures {
  context: BrowserContext;
  metamask: Dappwright;
  toast: ToastPage;
  swapPage: SwapPage;
  header: HeaderPage;
  poolPage: PoolPage;
  addLiquidityPage: AddLiquidityPage;
  withdrawPage: WithdrawPage;
  modal: ModalPage;
  portfolioPage: PortfolioPage;
}

const testFixtures: Fixtures<TestFixtures, unknown, PlaywrightTestArgs, PlaywrightWorkerArgs> = {
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    // Launch context with the same session from global-setup
    const { browserContext } = await dappwright.launch('', {
      version: metamaskVersion,
      wallet: 'metamask',
      // Headless tests only in CI
      headless: !!process.env.CI,
    });

    await use(browserContext);
    await browserContext.close();
  },
  metamask: async ({ context }, use) => {
    const metamask = await dappwright.getWallet('metamask', context);

    await metamask.switchNetwork('polygon');
    await use(metamask);
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
  portfolioPage: async ({ page }, use) => {
    await use(new PortfolioPage(page));
  },
  header: async ({ page, metamask }, use) => {
    const header = new HeaderPage(page, metamask);
    await use(header);
  },
  modal: async ({ page }, use) => {
    const modal = new ModalPage(page);
    await use(modal);
  },
};

export const test = testBase.extend<TestFixtures>(testFixtures);
export const expect = test.expect;

// If one of the tests fails, all subsequent tests are skipped.
// All tests in the group are retried together.
test.describe.configure({ mode: 'serial' });
