import { expect, Page, test as base } from '@playwright/test';
import { Dappwright } from '@tenkeylabs/dappwright';
import testFixtures, { TestFixtures } from './fixtures/testFixtures';

const networkName = 'goerli';

export const test = base.extend<TestFixtures>(testFixtures);

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

  const loadingWalletButtonHidden = await getLoadingAccountButton().isHidden();
  const accountButtonHidden = await getAccountButton().isHidden();

  // Check if the wallet is not yet connected
  if (accountButtonHidden && loadingWalletButtonHidden) {
    await page.getByRole('button', { name: 'Connect wallet' }).first().click();

    await page.getByRole('button', { name: 'Metamask' }).click({ force: true });
    // Approve the connection when MetaMask pops up
    await metamask.approve();

    // Wait for the dapp to redirect
    await page.waitForURL('http://localhost:8080/#/' + networkName);

    // Check the wallet button in nav
    expect(await getAccountButton()).toBeVisible();
  }

  if (await getMismatchNetworkMessage().isVisible()) {
    // Switch to correct network
    await metamask.switchNetwork(networkName);
    await page.bringToFront();
  }
  await expect(getMismatchNetworkMessage()).toBeHidden();

  // TODO: Try this with Polygon
  // // Change to correct network
  // await expect(
  //   page.getByText(/Please switch to Polygon Mainnet/i)
  // ).toBeVisible();
  // await page.getByRole('button', { name: /Switch Network/i }).click();
  // // Approve the network change
  // await metamask.approve();
}

test.describe.configure({ mode: 'serial' }); // Avoid colliding browser sessions
test('can connect to an application', async ({ page, metamask }) => {
  await page.goto('http://localhost:8080/#/' + networkName, { timeout: 30000 });

  await metamask.unlock('testingtesting');
  page.bringToFront();

  await connectWallet(page, metamask);

  // Go to swap
  await page.getByRole('link', { name: 'Swap' }).click();

  await page.getByLabel(/Token Out/i).type('0.1');

  // Accept the high price impact
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
