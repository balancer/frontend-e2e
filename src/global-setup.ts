import { FullConfig } from '@playwright/test';
import dappwright, { MetaMaskWallet } from '@tenkeylabs/dappwright';
import * as dotenv from 'dotenv';
dotenv.config();

// export const metamaskVersion = '10.27.0';
export const metamaskVersion = MetaMaskWallet.recommendedVersion;

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
    version: metamaskVersion,
    // Headless tests only in CI
    headless: !!process.env.CI,
  });

  console.log('Global setup finished installing metamask');
  await context.close();
}

export default globalSetup;
