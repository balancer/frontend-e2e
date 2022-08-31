# Balancer Frontend testing with Synpress

- [Synpress docs](https://github.com/Synthetixio/synpress#readme)

## Local Setup

1. Create file `.env.local` to project root and add these [required env variables](https://github.com/Synthetixio/synpress#-important):

   - ```sh
        SECRET_WORDS="word1 word2 ... ... etc"
        NETWORK_NAME=goerli
     ```
   - If you want to use a specific Metamask acocunt, add the account number env variable to `.env.local`. Eg. `CYPRESS_WALLET_ACCOUNT_NUMBER=3`

2. Start the [Frontend App](https://github.com/balancer-labs/frontend-v2/) using the same network you defined in `.env` file.

   - Eg. Start with Goerli testnet by running: `$ VUE_APP_NETWORK=5 npm run serve`

3. Once the frontend is up and running, you can start running the Synpress tests:

   - `$ npm run synpress:start`

4. After test run is complete, Cypress window stays open so you can investigate the test results.
   - If you want, you can generate test report by running: `$ npm run synpress:report`
   - Report is saved to: `synpress/report/mochawesome.html`

## Running in CI

- [E2E Job config](https://github.com/balancer-labs/frontend-v2/blob/develop/.github/workflows/checks.yml)
- CI testing Wallet address: `0xc9a9532a0d0ca26174caa328c5972a4bdc42c93b`

If the tests fail in CI, you can download the test report artifact with video and screenshots from the workflow's Summary Page.

<img width="500" alt="Download job artifacts" src="./Download job artifacts.png">

### Adding new tests and fixing tests

- Checkout branch of `frontend-e2e` and make changes to tests
- Set that branch in `frontend-v2` E2E job: `.github/workflow/checks.yml`

  - ```diff
    uses: actions/checkout@v2
    with:
      repository: balancer-labs/frontend-e2e
    + ref: new-e2e-branch-name
      path: e2e
    ```

- When test have run successfully, merge `frontend-e2e` PR, then remove brach `ref` line in `.github/workflow/checks.yml` and merge your `frontend-v2` PR.

## Synpress caveats

1. Running individual tests locally by opening Cypress UI is not supported because Synpress doesn't clear metamask state before each e2e test. To run only selected tests, mark them with `.only` and `.skip` as defined in [Mocha documentation](https://mochajs.org/#exclusive-tests).
2. Default way to add custom commands to Cypress (using: `Cypress.Commands.add` method) seems to cause Synpress to crash in the pipeline. Add custom commands to [customCommands.ts](synpress/customCommands.ts).
3. For now there's only 1 test file in the `/specs` folder. If more spec files are added, Synpress will anyway run only 1 of them. (Probably a bug in Synpress).
