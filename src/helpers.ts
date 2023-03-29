import { Page } from 'playwright-core';

export function gotoPath(path: string, page: Page) {
  return page.goto(`/#/polygon/${path}`, {
    timeout: 30000,
  });
}
