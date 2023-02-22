import { FullConfig } from '@playwright/test';
import dappwright, { MetaMaskWallet } from '@tenkeylabs/dappwright';
// import playwright from 'playwright';
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
    password: 'testingbal123',
    seed: process.env.SEED_PHRASE,
    version: MetaMaskWallet.recommendedVersion,
  });

  // Add Polygon network
  // await metamask.addNetwork({
  //   networkName: 'polygon',
  //   rpc: 'https://polygon-rpc.com',
  //   chainId: 137,
  //   symbol: 'Matic',
  // });
  // await metamask.switchNetwork('polygon');

  // Add an extra account
  // await metamask.createAccount();

  await context.close();
}

export default globalSetup;
