import { Page } from 'playwright-core';
import { network } from './fixtures/testFixtures';

export function gotoPath(path: string, page: Page) {
  return page.goto(`/#/${network.networkName}/${path}`, {
    timeout: 30000,
  });
}
