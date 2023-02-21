import { expect } from '@playwright/test';
import { connectWallet, test } from './fixtures/testFixtures';

test.beforeEach(async ({ page, metamask }) => {
  await connectWallet(page, metamask);
});

test('Swap ETH to USDC', async ({ page, metamask, toast }) => {
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
  expect(await toast.getByText(/Swap pending/i)).toBeVisible();

  // Check the Swap confirmed toast shows up
  await toast.getByText(/Swap confirmed/i).waitFor({
    state: 'visible',
    // Increase timeout while waiting for the Swap to be confirmed
    timeout: 60000,
  });

  expect(await toast.getByText(/Swap confirmed/i)).toBeVisible();
});
