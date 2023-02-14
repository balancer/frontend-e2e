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
  });

  // Add Polygon network
  // await metamask.addNetwork({
  //
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
