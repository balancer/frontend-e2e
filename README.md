# Balancer Frontend testing with Synpress

- [Dappwright docs](https://github.com/TenKeyLabs/dappwright)
- [Dappwright api](https://github.com/TenKeyLabs/dappwright/blob/main/docs/API.md)

## Local Setup

1. Create file `.env` to project root and add these required env variables:

   - ```sh
        SEED_PHRASE="word1 word2 ... ... etc"
     ```

2. Start the [Frontend App](https://github.com/balancer-labs/frontend-v2/) by running: `npm run serve`

3. Once the frontend is up and running, you can start running the Playwright tests:

   - `$ npm run playwright:test`

4. After test run is complete, Playwright serves a test report, and it should open up automatically.

## Running in CI

- [E2E Job config](https://github.com/balancer-labs/frontend-v2/blob/develop/.github/workflows/checks.yml)
- CI testing Wallet address: `0xc9a9532a0d0ca26174caa328c5972a4bdc42c93b`

If the tests fail in CI, you can download the test report artifact that contains the test traces from the workflow's Summary Page.

Drop the downloaded test artifact zip file to: `https://trace.playwright.dev/` to see the test run in action.

<img width="500" alt="Download job artifacts" src="./Download job artifacts.png">

### Adding new tests and fixing tests

- Checkout branch of `frontend-e2e` and make changes to tests
- Set that branch in `frontend-v2` E2E job: `.github/workflow/checks.yml`

  - ```diff
      - name: Checkout Playwright app
        uses: actions/checkout@v3
        with:
          repository: balancer-labs/frontend-e2e
    +     # Checkout a specific branch
    +     ref: e2e-new-branch-name
    ```

- When test have run successfully, merge `frontend-e2e` PR, then remove brach `ref` line in `.github/workflow/checks.yml` and merge your `frontend-v2` PR.

## Dappwright caveats

1. Tests can not be run parallel in order to avoid colliding browser sessions
