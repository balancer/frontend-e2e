/// <reference types="cypress" />

describe('Test User Login', () => {
  // TODO: Remove this test
  it.only('fails', () => {
    cy.visit('/');
    cy.findByRole('button', { name: /Fail/i }).should('be.visible');
  });
  it('Connects with Metamask', () => {
    cy.visit('/');
    // find "Connect Wallet" button and click it
    cy.get('nav')
      .within(() => {
        cy.findByRole('button', { name: /Connect Wallet/i }).click();
      })
      .then(() => {
        cy.findByRole('button', { name: /Metamask/i }).click();
      });
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
    cy.findByRole('button', { name: /0xf39F\.\.\.2266/i }).should('be.visible');
  });
});
