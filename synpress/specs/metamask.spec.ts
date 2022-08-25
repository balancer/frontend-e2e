import { connectWallet } from '../utils';

describe('Test User Login', () => {
  it('Connects with Metamask', () => {
    cy.visit('/');

    connectWallet();
    // assuming there is only metamask popping up
    // always important to switch between metamask and cypress window
    cy.switchToMetamaskWindow();
    // connect to dapp
    cy.acceptMetamaskAccess(undefined).should('be.true');

    // Confirming not needed?
    // cy.confirmMetamaskSignatureRequest();

    // switch back to cypress window (your dApp)
    cy.switchToCypressWindow();
    // check UI change
    cy.findByRole('button', { name: /0xc9a9\.\.\.c93b/i }).should('be.visible');
  });

  it('Does a token swap', () => {
    cy.visit('/#/trade');

    connectWallet();

    cy.findByLabelText(/Token Out/i).type('0.1');
    cy.findByRole('button', { name: /Preview/i }).click();
    cy.findByRole('button', { name: /Confirm trade/i }).click();
    cy.confirmMetamaskTransaction(undefined);

    cy.findByText(/Trade pending/i).should('be.visible');

    // Increase timeout while waiting for the trade to be confirmed
    cy.findByText(/Trade confirmed/i, { timeout: 40000 }).should('be.visible');
  });
});
