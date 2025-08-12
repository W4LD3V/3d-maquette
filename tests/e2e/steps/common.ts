import { Given } from '@wdio/cucumber-framework';

Given('the app is running', async () => {
});

Given('I open {string}', async (path: string) => {
  await browser.url(path);
});
