import { expect, Page } from '@playwright/test';
import { Dappwright } from '@tenkeylabs/dappwright';
import { test } from './fixtures/testFixtures';

// Goerli
const network = {
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

async function connectWallet(page: Page, metamask: Dappwright) {
  const getAccountButton = () =>
    page.getByRole('button', {
      name:
        // Eg. 0x1234...1234
        /0x.{4}(...).{4}/i,
    });
  const getLoadingAccountButton = () =>
    page.getByRole('button', {
      name: /Connecting.../i,
    });
  const getMismatchNetworkMessage = () => page.getByText(/Please switch to /i);

  await metamask.unlock('testingbal123');
  page.bringToFront();

  // Wait for a moment for the page to load, to see if the wallet is connected automatically
  await page.waitForTimeout(1000);

  const loadingWalletButtonHidden = await getLoadingAccountButton().isHidden();
  const accountButtonHidden = await getAccountButton().isHidden();

  // Check if the wallet is not yet connected
  if (accountButtonHidden && loadingWalletButtonHidden) {
    await page.getByRole('button', { name: 'Connect wallet' }).first().click();

    await page.getByRole('button', { name: 'Metamask' }).click({ force: true });
    // Approve the connection when MetaMask pops up
    await metamask.approve();

    // // Wait for the dapp to redirect
    // await page.waitForURL('http://localhost:8080/#/' + network.networkName);

    // Check the wallet button in nav
    expect(await getAccountButton()).toBeVisible();
  }

  if (await getMismatchNetworkMessage().isVisible()) {
    const hasNetwork = await metamask.hasNetwork(network.networkName);

    if (!hasNetwork) {
      await metamask.switchNetwork(network.networkName);
    } else if (network.networkName === 'polygon') {
      // Add Polygon network if not yet added
      await metamask.addNetwork(network);
    }

    // Switch to correct network
    await page.bringToFront();
    // Temporary fix to make the mismatch network message disappear
    await page.reload();
  }
  expect(await getMismatchNetworkMessage()).toBeHidden();
}

test.beforeEach(async ({ page, metamask }) => {
  await page.goto('http://localhost:8080/#/' + network.networkName, {
    timeout: 30000,
  });
  await connectWallet(page, metamask);
});

test('Swap ETH to USDC', async ({ page, metamask }) => {
  // Go to swap
  await page.getByRole('link', { name: 'Swap' }).click();

  await page.getByLabel(/Token Out/i).type('0.1');

  // Accept the high price impact
  // Not needed on Polygon
  await page.getByRole('button', { name: /Accept/i }).click();

  await page.getByRole('button', { name: /Preview/i }).click();

  await page.getByRole('button', { name: /Confirm Swap/i }).click();
  await metamask.confirmTransaction();

  // Check the Swap pending toast shows up
  expect(await page.getByText(/Swap pending/i)).toBeVisible();

  // Check the Swap confirmed toast shows up
  await page.getByText(/Swap confirmed/i).waitFor({
    state: 'visible',
    // Increase timeout while waiting for the Swap to be confirmed
    timeout: 60000,
  });

  expect(await page.getByText(/Swap confirmed/i)).toBeVisible();
});

test('Add liquidity to Weighted pool', async ({ page, metamask, toast }) => {
  // Click the weighted pool cell in the pools table
  await page.getByRole('cell', { name: 'WETH 50% USDC 50%' }).click();

  // Go to Add Liquidity page
  await page.getByRole('link', { name: /Add Liquidity/i }).click();

  // Wait for the page and form to load
  const form = await page.getByTestId('add-liquidity-form');

  // Type in the amount of ETH to add
  await form.getByLabel(/Amount of: ETH/i).type('0.0001');

  // Click the preview button
  await page.getByRole('button', { name: /Preview/i }).click();

  // Click the confirm button
  await page.getByRole('button', { name: /Add Liquidity/i }).click();

  await metamask.confirmTransaction();

  // Check the button is disabled and loading
  expect(
    await page.getByRole('button', { name: /Confirming.../i })
  ).toBeDisabled();

  // Check the Add Liquidity pending toast shows up
  expect(await toast.getByText(/Add Liquidity pending/i)).toBeVisible();

  // Check the Add Liquidity confirmed toast shows up
  await toast.getByText(/Add Liquidity confirmed/i).waitFor({
    state: 'visible',
    // Increase timeout while waiting for the Add Liquidity to be confirmed
    timeout: 60000,
  });
  expect(await toast.getByText(/Add Liquidity confirmed/i)).toBeVisible();
});
