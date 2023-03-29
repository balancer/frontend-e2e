import { Dappwright } from '@tenkeylabs/dappwright';
import { test } from '../fixtures/testFixtures';
import HeaderPage from '../pages/Header.page';
import PoolPage from '../pages/Pool.page';
import ToastPage from '../pages/Toast.page';
import WithdrawPage from '../pages/Withdraw.page';

async function goToStMaticPoolFromMainPage(header: HeaderPage, poolPage: PoolPage) {
  await header.goToMainPage();
  await header.connectWallet();

  // Composable Stable Pool WMATIC-stMATIC
  await poolPage.clickPoolWithStMatic();
}

async function goToStMaticPool(header: HeaderPage, poolPage: PoolPage) {
  await poolPage.goto('0x8159462d255c1d24915cb51ec361f700174cd99400000000000000000000075d');
  await header.connectWallet();
}

test.describe('Pool page', () => {
  /**
   * This test visits the portfolio page to check if there's some missing balance in the stMatic pool (due to previous failing test execution)
   * If there is balance, it will exit the pool to enforce that the next tests are always executed in similar conditions
   * (and to avoid testing account balance problems)
   **/
  test.only('Enforce clean initial state', async ({
    header,
    portfolioPage,
    poolPage,
    withdrawPage,
    metamask,
    toast,
  }) => {
    await portfolioPage.goto();
    await header.connectWallet();
    if (await portfolioPage.hasBalanceInPoolWithStMatic()) {
      // Temporarily throw an error to understand error frequency
      // throw new Error('Test account has balance in wMATIC stMATIC pool. Exit is needed.');
      await portfolioPage.goToPoolWithStMatic();
      await exitPool(poolPage, withdrawPage, metamask, toast);
    }
  });

  test('Join pool', async ({ metamask, toast, header, poolPage, addLiquidityPage }) => {
    await goToStMaticPoolFromMainPage(header, poolPage);

    await poolPage.clickAddLiquidityLink();

    await addLiquidityPage.typeToInput('WMATIC', '2');

    await addLiquidityPage.clickPreviewButton();

    // TODO: this step is needed just in certain conditions (can we detect those?)
    // await addLiquidityPage.clickApproveButton();

    await addLiquidityPage.clickAddLiquidity();

    await metamask.confirmTransaction();

    // Check the button is disabled and loading
    await addLiquidityPage.verifyConfirmButtonDisabled();

    // Check the Add Liquidity pending toast shows up
    await toast.verifyToastVisibility(toast.addLiquidityToast.pending);

    // Check the Add Liquidity confirmed toast shows up
    await toast.verifyToastVisibility(toast.addLiquidityToast.confirmed);
  });

  test('Exit pool', async ({ header, poolPage, withdrawPage, metamask, toast }) => {
    await goToStMaticPool(header, poolPage);
    await exitPool(poolPage, withdrawPage, metamask, toast);
  });
});

// Helper used by "Exit pool test" and, optionally, by "Enforce clean initial state" test
async function exitPool(
  poolPage: PoolPage,
  withdrawPage: WithdrawPage,
  metamask: Dappwright,
  toast: ToastPage
) {
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
}
