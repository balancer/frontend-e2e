import { Page } from '@playwright/test';
import { Dappwright } from '@tenkeylabs/dappwright';
import { test, expect } from '../fixtures/testFixtures';

test.describe('Swap page', () => {
  test.beforeEach(async ({ swapPage, header }) => {
    // Go to swap
    await swapPage.goto();
    await header.connectWallet();
  });

  test('Swap ETH to USDC', async ({ swapPage, metamask, toast }) => {
    await swapPage.typeToTokenOutInput('0.1');

    // Accept the high price impact
    // Not needed on Polygon
    await swapPage.acceptHighPriceImpact();

    await swapPage.openPreviewModal();

    await swapPage.confirmSwap();

    await metamask.confirmTransaction();

    // Check the Swap pending toast shows up
    await toast.verifyToastVisibility(toast.swapToast.pending);

    // Check the Swap confirmed toast shows up
    await toast.verifyToastVisibility(toast.swapToast.confirmed);
  });
});
