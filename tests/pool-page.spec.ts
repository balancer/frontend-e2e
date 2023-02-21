import { expect } from '@playwright/test';
import { connectWallet, test } from './fixtures/testFixtures';

test.beforeEach(async ({ page, metamask }) => {
  await connectWallet(page, metamask);
});

test.describe('Pool page', () => {
  test('Add liquidity to Weighted pool', async ({ page, metamask, toast }) => {
    // Click the weighted pool cell in the pools table
    await page.getByRole('cell', { name: 'WBTC 50% WETH 50%' }).click();

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
    await toast.waitUntilVisible(/Add Liquidity pending/i);

    // Check the Add Liquidity confirmed toast shows up
    await toast.waitUntilVisible(/Add Liquidity confirmed/i);
  });

  test('Stake Weighted pool', async ({ page, metamask, toast, modal }) => {
    // Click the weighted pool cell in the pools table
    await page.getByRole('cell', { name: 'WBTC 50% WETH 50%' }).click();

    // Open the staking menu
    await page.getByRole('button', { name: /Staking incentives/i }).click();

    // Click the Stake button
    await page.getByRole('button', { name: /^Stake$/i }).click();

    // Click the stake button from modal
    modal.getByRole('button', { name: /Stake/i }).click();

    await metamask.confirmTransaction();

    // Check the Stake pending toast shows up
    toast.waitUntilVisible(/Stake pending/i);

    // Check the Stake confirmed toast shows up
    await toast.waitUntilVisible(/Stake confirmed/i);
  });

  test('Unstake Weighted pool', async ({ page, metamask, toast, modal }) => {
    // Click the weighted pool cell in the pools table
    await page.getByRole('cell', { name: 'WBTC 50% WETH 50%' }).click();

    // Open the staking menu
    await page.getByRole('button', { name: /Staking incentives/i }).click();

    // Click the Stake button
    await page.getByRole('button', { name: /^Unstake$/i }).click();

    // Click the stake button from modal
    modal.getByRole('button', { name: /Unstake/i }).click();

    await metamask.confirmTransaction();

    // Check the Unstake pending toast shows up
    await toast.waitUntilVisible(/Unstake pending/i);

    // Check the Unstake confirmed toast shows up
    await toast.waitUntilVisible(/Unstake confirmed/i);
  });

  test('Withdraw from Weighted pool', async ({ page, metamask, toast }) => {
    // Click the weighted pool cell in the pools table
    await page.getByRole('cell', { name: 'WBTC 50% WETH 50%' }).click();

    // Go to Withdraw page
    await page.getByRole('link', { name: /Withdraw/i }).click();

    // Click the preview button
    await page.getByRole('button', { name: /Preview/i }).click();

    // Click the confirm button
    await page.getByRole('button', { name: /Withdraw/i }).click();

    await metamask.confirmTransaction();

    // Check the button is disabled and loading
    expect(
      await page.getByRole('button', { name: /Confirming.../i })
    ).toBeDisabled();

    // Check the Withdraw pending toast shows up
    await toast.waitUntilVisible(/Withdraw pending/i);

    // Check the Withdraw confirmed toast shows up
    await toast.waitUntilVisible(/Withdraw confirmed/i);
  });
});
