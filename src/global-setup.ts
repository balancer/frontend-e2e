import { FullConfig } from '@playwright/test';
import dappwright, { MetaMaskWallet } from '@tenkeylabs/dappwright';
import * as dotenv from 'dotenv';
dotenv.config();

async function globalSetup(config: FullConfig) {
  if (!process.env.SEED_PHRASE) {
    throw new Error(
      'Please set the SEED_PHRASE environment variable in order to set the correct testing wallet!'
    );
  }
  const [metamask, page, context] = await dappwright.bootstrap('', {
    wallet: 'metamask',
    showTestNets: true,
    password: process.env.PASSWORD,
    seed: process.env.SEED_PHRASE,
    version: MetaMaskWallet.recommendedVersion,
    // Headless tests only in CI
    headless: !!process.env.CI,
  });

  const goerli = {
    networkName: 'goerli',
    rpc: 'https://goerli.blockpi.network/v1/rpc/public',
    chainId: 5,
    symbol: 'ETH',
  };

  await metamask.addNetwork(goerli);
  // await metamask.switchNetwork('goerli');

  console.log('Global setup finished installing metamask with goerli network');
  await context.close();
}

export default globalSetup;
