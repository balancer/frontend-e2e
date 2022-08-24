# Balancer Frontend testing with Synpress

**Test wallet address:** `0xc9a9532a0d0ca26174caa328c5972a4bdc42c93b`

## Local Setup

1. Create file `.env.local` to project root and add these required env variables:

```sh
SECRET_WORDS="word1 word2 ... ... etc"
NETWORK_NAME=goerli
```

2. Start the frontend app using the same network you defined in `.env` file.

   - Eg. `$ VUE_APP_NETWORK=1 npm run serve`

3. Once the frontend is up and running, you can start running the Synpress tests:

   - `$ npm run synpress:start`

4. After test run is complete, you can see the test report in `synpress/report/mochawesome.html`

## Running in CI

[E2E Job config](https://github.com/balancer-labs/frontend-v2/blob/develop/.github/workflows/checks.yml)

If the tests fail in CI, you can download the test report artifact with video and screenshots from the job's Summary Page.

| Download job artifacts                                                            |
| --------------------------------------------------------------------------------- |
| <img width="300" alt="Download job artifacts" src="./Download job artifacts.png"> |
