import { expect } from '@playwright/test';
import { connectWallet, test } from './fixtures/testFixtures';

test.beforeEach(async ({ page, metamask }) => {
  await connectWallet(page, metamask);
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
