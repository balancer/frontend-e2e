/// <reference types="cypress" />
import './commands';
import '@synthetixio/synpress/support';
import addContext from 'mochawesome/addContext';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to click Connect Wallet Button in Nav and
       * select Metamask
       */
      connectWallet(): void;
    }
  }
}

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const imageUrl = `assets/screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
    const videoUrl = `assets/videos/${Cypress.spec.name}.mp4`;

    const screenshot = {
      title: 'Screenshot',
      value: imageUrl,
    };

    const video = {
      title: 'Video',
      value: videoUrl,
    };

    addContext({ test }, screenshot);
    addContext({ test }, video);
  }
});

// find "Connect Wallet" button and click it
Cypress.Commands.add('connectWallet', () => {
  cy.get('nav')
    .within(() => {
      cy.findByRole('button', { name: /Connect Wallet/i }).click();
    })
    .then(() => {
      cy.findByRole('button', { name: /Metamask/i }).click();
    });
});
