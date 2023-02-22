import { expect, Page } from '@playwright/test';
import { Dappwright } from '@tenkeylabs/dappwright';
import { connectWallet, test } from '../fixtures/testFixtures';

test.describe('Swap page', () => {
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
    await toast.verifyToastVisibility(toast.swapToast.pending);

    // Check the Swap confirmed toast shows up
    await toast.verifyToastVisibility(toast.swapToast.confirmed);
  });
});
