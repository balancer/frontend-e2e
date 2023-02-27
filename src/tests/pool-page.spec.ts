import { test } from '../fixtures/testFixtures';

test.describe('Pool page', () => {
  test.beforeEach(async ({ header, poolPage }) => {
    // WBTC 50% WETH 50% in Goerli
    await poolPage.goto('0x16faf9f73748013155b7bc116a3008b57332d1e600020000000000000000005b');
    await header.connectWallet();
  });

  test('Add liquidity to Weighted pool', async ({
    metamask,
    toast,
    poolPage,
    addLiquidityPage,
  }) => {
    // Go to Add Liquidity page
    await poolPage.clickAddLiquidityLink();

    // Type the amount of ETH to add
    await addLiquidityPage.typeToInput('ETH', '0.0001');

    // Click the preview button
    await addLiquidityPage.clickPreviewButton();

    // Click the confirm button
    await addLiquidityPage.clickConfirmButton();

    await metamask.confirmTransaction();

    // Check the button is disabled and loading
    await addLiquidityPage.verifyConfirmButtonDisabled();

    // Check the Add Liquidity pending toast shows up
    await toast.verifyToastVisibility(toast.addLiquidityToast.pending);

    // Check the Add Liquidity confirmed toast shows up
    await toast.verifyToastVisibility(toast.addLiquidityToast.confirmed);
  });

  test('Stake Weighted pool', async ({ poolPage, metamask, toast }) => {
    // Open the staking menu
    await poolPage.clickStakingMenu();

    // Open the stake modal
    await poolPage.openStakeModal();

    await poolPage.confirmStake();

    await metamask.confirmTransaction();

    // Check the Stake pending toast shows up
    await toast.verifyToastVisibility(toast.stakeToast.pending);

    // Check the Stake confirmed toast shows up
    await toast.verifyToastVisibility(toast.stakeToast.confirmed);
  });

  test('Unstake Weighted pool', async ({ poolPage, metamask, toast }) => {
    // Open the staking menu
    await poolPage.clickStakingMenu();

    // Click the Unstake button
    await poolPage.openUnstakeModal();

    await poolPage.confirmUnstake();

    await metamask.confirmTransaction();

    // Check the Unstake pending toast shows up
    await toast.verifyToastVisibility(toast.unstakeToast.pending);

    // Check the Unstake confirmed toast shows up
    await toast.verifyToastVisibility(toast.unstakeToast.confirmed);
  });

  test('Withdraw from Weighted pool', async ({ poolPage, withdrawPage, metamask, toast }) => {
    // Go to Withdraw page
    await poolPage.clickWithdrawLink();

    // Click the preview button
    await withdrawPage.clickPreviewButton();

    // Click the confirm button
    await withdrawPage.clickConfirmButton();

    await metamask.confirmTransaction();

    // Check the button is disabled and loading
    await withdrawPage.verifyConfirmButtonDisabled();

    // Check the Withdraw pending toast shows up
    await toast.verifyToastVisibility(toast.withdrawToast.pending);

    // Check the Withdraw confirmed toast shows up
    await toast.verifyToastVisibility(toast.withdrawToast.confirmed);
  });
});
