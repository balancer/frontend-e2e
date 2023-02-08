import {
  BrowserContext,
  Fixtures,
  PlaywrightTestArgs,
  PlaywrightWorkerArgs,
} from '@playwright/test';

import dappwright, { Dappwright, MetaMaskWallet } from '@tenkeylabs/dappwright';

export interface TestFixtures {
  context: BrowserContext;
  metamask: Dappwright;
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
};

export default testFixtures;
