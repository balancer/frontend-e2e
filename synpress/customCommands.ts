/**
 * Default way to add custom commands to Cypress (using: Cypress.Commands.add method)
 * seems to cause Synpress to crash in the pipeline.
 * Add custom commands here instead and import them in the test you need
 */

export function connectWallet() {
  return (
    cy
      // find "Connect Wallet" button in nav bar and click it
      .get('nav')
      .within(() => {
        cy.findByRole('button', { name: /Connect Wallet/i }).click();
      })
      .then(() => {
        // Select metamask from modal
        cy.findByRole('button', { name: /Metamask/i }).click();

        cy.window()
          .then((win: any) =>
            !win.ethereum
              ? []
              : win.ethereum.request({ method: 'eth_accounts' })
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
      })
  );
}
