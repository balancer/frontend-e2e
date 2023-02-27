import { test } from '../fixtures/testFixtures';

test.describe('Swap page', () => {
  test.beforeEach(async ({ swapPage, header }) => {
    // Go to swap
    await swapPage.goto();
    await header.connectWallet();
  });

  test('Swap ETH to USDC', async ({ swapPage, metamask, toast }) => {
    await swapPage.typeToTokenOutInput('0.1');

    // Accept the high price impact is needed on Goerli
    await swapPage.acceptHighPriceImpact();

    await swapPage.showSwapPreview();

    await swapPage.clickConfirmSwap();

    await metamask.confirmTransaction();

    // Check the Swap pending toast shows up
    await toast.verifyToastVisibility(toast.swapToast.pending);

    // Check the Swap confirmed toast shows up
    await toast.verifyToastVisibility(toast.swapToast.confirmed);
  });
});
