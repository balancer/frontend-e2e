import { FullConfig } from '@playwright/test';
import dappwright, { MetaMaskWallet } from '@tenkeylabs/dappwright';
// import playwright from 'playwright';

async function globalSetup(config: FullConfig) {
  console.log('check variables', process.env.CI);
  const [metamask, page, context] = await dappwright.bootstrap('', {
    wallet: 'metamask',
    password: 'testingtesting',
    seed: process.env.SECRET_WORDS,
    version: MetaMaskWallet.recommendedVersion,
    headless: !!process.env.CI,
  });

  // Add Hardhet network
  // await metamask.addNetwork({
  //   networkName: 'Hardhat',
  //   rpc: 'http://127.0.0.1:8545/',
  //   chainId: 31337,
  //   symbol: 'ETH',
  // });

  // Add an extra account
  // await metamask.createAccount();

  await context.close();
}

export default globalSetup;
