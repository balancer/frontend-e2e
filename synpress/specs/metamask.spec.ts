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
    cy.visit('/#/goerli/trade');

    connectWallet();

    cy.findByLabelText(/Token Out/i).type('0.1');

    // Accept the high price impact
    cy.findByText(/High price impact/i).should('be.visible');
    cy.findByRole('button', { name: /Accept/i }).click();

    cy.findByRole('button', { name: /Preview/i }).click();
    cy.findByRole('button', { name: /Confirm swap/i }).click();

    cy.confirmMetamaskTransaction(undefined);

    cy.findByText(/Swap pending/i).should('be.visible');

    // Increase timeout while waiting for the Swap to be confirmed
    cy.findByText(/Swap confirmed/i, { timeout: 60000 }).should('be.visible');
  });
});
