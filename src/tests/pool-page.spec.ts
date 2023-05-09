import { Dappwright } from '@tenkeylabs/dappwright';
import { test } from '../fixtures/testFixtures';
import HeaderPage from '../pages/Header.page';
import PoolPage from '../pages/Pool.page';
import ToastPage from '../pages/Toast.page';
import WithdrawPage from '../pages/Withdraw.page';

// StMATIC/Boosted Aave V3 WMATIC
const wMaticPoolId = '0x216690738aac4aa0c4770253ca26a28f0115c595000000000000000000000b2c';

async function goToWMaticPoolFromMainPage(header: HeaderPage, poolPage: PoolPage) {
  await header.goToMainPage();
  await header.connectWallet();

  await poolPage.clickPool(wMaticPoolId);
}

async function goToWMaticPool(header: HeaderPage, poolPage: PoolPage) {
  await poolPage.goto(wMaticPoolId);
  await header.connectWallet();
}

test.describe('Pool page', () => {
  /**
   * This test visits the portfolio page to check if there's some missing balance in the stMatic pool (due to previous failing test execution)
   * If there is balance, it will exit the pool to enforce that the next tests are always executed in similar conditions
   * (and to avoid testing account balance problems)
   **/
  test('Enforce clean initial state', async ({
    header,
    portfolioPage,
    poolPage,
    withdrawPage,
    metamask,
    toast,
  }) => {
    await portfolioPage.goto();
    await header.connectWallet();
    if (await portfolioPage.hasBalanceInPoolWithWMatic()) {
      // Temporarily throw an error to understand error frequency
      // throw new Error('Test account has balance in wMATIC stMATIC pool. Exit is needed.');
      await portfolioPage.goToPoolWithWMatic();
      await exitPool(poolPage, withdrawPage, metamask, toast);
    }
  });

  test('Join pool', async ({ toast, header, poolPage, addLiquidityPage, metamask }) => {
    await goToWMaticPoolFromMainPage(header, poolPage);

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
    await goToWMaticPool(header, poolPage);
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
  await poolPage.clickWithdrawLink();

  await withdrawPage.selectMaxWMatic();

  await withdrawPage.clickPreviewButton();

  await withdrawPage.clickConfirmButton();

  await metamask.confirmTransaction();

  // Check the button is disabled and loading
  await withdrawPage.verifyConfirmButtonDisabled();

  // Check the Withdraw pending toast shows up
  await toast.verifyToastVisibility(toast.withdrawToast.pending);

  // Check the Withdraw confirmed toast shows up
  await toast.verifyToastVisibility(toast.withdrawToast.confirmed);
}
