/**
 * Default way to add custom commands to Cypress (using: Cypress.Commands.add method)
 * seems to cause Synpress to crash in the pipeline.
 * Add custom commands here instead and import them in the test you need
 */

// find "Connect Wallet" button and click it
export function connectWallet() {
  return cy
    .get('nav')
    .within(() => {
      cy.findByRole('button', { name: /Connect Wallet/i }).click();
    })
    .then(() => {
      cy.findByRole('button', { name: /Metamask/i }).click();
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.window()
        .then((win: any) =>
          !win.ethereum ? [] : win.ethereum.request({ method: 'eth_accounts' })
        )
        .then(accounts => {
          if (!accounts.length) {
            cy.switchToMetamaskWindow();
            cy.acceptMetamaskAccess(undefined).should('be.true');

            // Confirming not needed?
            // cy.confirmMetamaskSignatureRequest();

            cy.switchToCypressWindow();
          }
        });
    });
}
