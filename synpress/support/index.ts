/// <reference types="cypress" />
import './commands';
import '@synthetixio/synpress/support';
import addContext from 'mochawesome/addContext';

// Add screenshots and video to test report
Cypress.on('test:after:run', (test, runnable) => {
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
});

// before(async () => {
//   if (!Cypress.env('SKIP_METAMASK_SETUP')) {
//     // await cy.setupMetamask();
//   }
// });

// Cypress.Commands.overwrite(
//   'setupMetamask',
//   (secretWordsOrPrivateKey, network, password = 'Tester@1234') => {
//     cy.task('setupMetamask', {
//       secretWordsOrPrivateKey,
//       network,
//       password,
//     });
//     cy.wait(1000);
//     cy.switchToMetamaskWindow();
//     const accountNumber = 3;

//     for (let i = 0; i <= accountNumber; i++) {
//       cy.createMetamaskAccount(undefined);
//     }
//     cy.acceptMetamaskAccess(undefined).should('be.true');
//     cy.switchMetamaskAccount(accountNumber);
//     cy.switchToCypressWindow();
//   }
// );
