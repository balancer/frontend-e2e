/**
 * Default way to add custom commands to Cypress (using: Cypress.Commands.add method)
 * seems to cause Synpress to crash in the pipeline.
 * Add custom commands here instead and import them in the test you need
 */

function getMetamaskAccounts() {
  return cy
    .window()
    .then(
      (win: any) => win.ethereum?.request({ method: 'eth_accounts' }) || []
    );
}

function selectMetamaskAccount(accountNumber: number) {
  cy.switchToMetamaskWindow();

  // Create new accounts until the desired account number is reached
  for (let i = 1; i < accountNumber; i++) {
    cy.createMetamaskAccount(undefined);
  }
  // Select the desired account
  cy.switchMetamaskAccount(accountNumber);
  cy.switchToCypressWindow();
}

export function connectWallet() {
  getMetamaskAccounts().then(accounts => {
    if (!accounts.length) {
      const accountNumber = Number(Cypress.env('WALLET_ACCOUNT_NUMBER')) || 1;
      selectMetamaskAccount(accountNumber);
    }

    cy
      // find "Connect Wallet" button in the nav bar and click it
      .get('nav')
      .within(() => {
        cy.findByRole('button', { name: /Connect Wallet/i }).click();
      })
      .then(() => {
        // Select metamask from modal
        cy.findByRole('button', { name: /Metamask/i }).click();

        if (!accounts.length) {
          cy.switchToMetamaskWindow();
          cy.acceptMetamaskAccess(undefined).should('be.true');

          cy.switchToCypressWindow();
        }
      });
  });
}
