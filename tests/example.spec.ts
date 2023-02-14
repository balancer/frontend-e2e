import { expect, Page, test as base } from '@playwright/test';
import { Dappwright } from '@tenkeylabs/dappwright';
import testFixtures, { TestFixtures } from './fixtures/testFixtures';

const networkName = 'ethereum';

export const test = base.extend<TestFixtures>(testFixtures);

async function connectWallet(page: Page, metamask: Dappwright) {
  const accountButton = page.getByRole('button', {
    name:
      // Eg. 0x1234...1234
      /0x.{4}(...).{4}/i,
  });
  const loadingAccountButton = page.getByRole('button', {
    name: /Connecting.../i,
  });

  const loadingWalletButtonHidden = await loadingAccountButton.isHidden();
  const accountButtonHidden = await accountButton.isHidden();

  // Check if the wallet is alreade connected
  if (accountButtonHidden && loadingWalletButtonHidden) {
    console.log('hello connect');
    await page.getByRole('button', { name: 'Connect wallet' }).first().click();

    await page.getByRole('button', { name: 'Metamask' }).click({ force: true });
    // Approve the connection when MetaMask pops up
    await metamask.approve();

    // Wait for the dapp to redirect
    await page.waitForURL('http://localhost:8080/#/' + networkName);

    // Check the wallet button in nav
    expect(await accountButton).toBeVisible();
  }
}

test.describe.configure({ mode: 'serial' }); // Avoid colliding browser sessions
test('can connect to an application', async ({ page, metamask }) => {
  await page.goto('http://localhost:8080/#/' + networkName, { timeout: 30000 });

  await metamask.unlock('testingtesting');
  page.bringToFront();

  await connectWallet(page, metamask);

  // Go to swap
  await page.getByRole('link', { name: 'Swap' }).click();

  await page.locator('input[name="tokenIn"]').fill('0.1');

  // page.getByText('High price impact');

  // It takes a long time to load preview button
  await page.getByRole('button', { name: /Preview/i }).click();

  await expect(page.getByText('Preview swap')).toBeVisible();

  await expect(
    page.getByRole('button', { name: /Confirm Swap/i })
  ).toBeVisible();
});
