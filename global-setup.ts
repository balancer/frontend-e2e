import { FullConfig } from '@playwright/test';
import dappwright, { MetaMaskWallet } from '@tenkeylabs/dappwright';
// import playwright from 'playwright';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

async function globalSetup(config: FullConfig) {
  console.log('secret words: ', process.env.SECRET_WORDS);
  console.log('even more secret: ', process.env.TEST_WALLET_SECRET_WORDS);
  console.log('testing key: ', process.env.TEST_KEY);
  const [metamask, page, context] = await dappwright.bootstrap('', {
    wallet: 'metamask',
    showTestNets: true,
    password: 'testingbal123',
    seed: process.env.SECRET_WORDS,
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
