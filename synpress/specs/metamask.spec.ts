import { connectWallet } from '../customCommands';

describe('Connect with Metamask', () => {
  it('Connects wallet', () => {
    cy.visit('/');

    connectWallet();

    // Check the wallet button in nav
    cy.findByRole('button', {
      name:
        // Eg. 0x1234...1234
        /0x.{4}(...).{4}/i,
    }).should('be.visible');
  });
});

describe('Trade page', () => {
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
