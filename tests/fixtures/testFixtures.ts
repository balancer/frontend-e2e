import {
  BrowserContext,
  Fixtures,
  Locator,
  PlaywrightTestArgs,
  PlaywrightWorkerArgs,
  test as base,
} from '@playwright/test';

import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright';

interface TestFixtures {
  context: BrowserContext;
  metamask: Dappwright;
  toast: Locator;
}

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
    const toast = await page.getByRole('alert').last();

    await use(toast);
  },
};

export const test = base.extend<TestFixtures>(testFixtures);

test.describe.configure({ mode: 'serial' }); // Avoid colliding browser sessions
