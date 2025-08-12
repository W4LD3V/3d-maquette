/// <reference types="expect-webdriverio" />
import { Given, When, Then } from '@wdio/cucumber-framework';
import { browser, $, expect } from '@wdio/globals';
import LoginPage from '../pages/login.page';
import DashboardPage from '../pages/dashboard.page';

const successAuth = { token: 'fake-jwt' };

async function mockAuthEndpoints() {
  const login = await browser.mock('**/api/login', { method: 'post' });
  const register = await browser.mock('**/api/register', { method: 'post' });

  (login as any).respond(
    () => JSON.stringify(successAuth),
    { statusCode: 200, headers: { 'content-type': 'application/json' } } as any
  );
  (register as any).respond(
    () => JSON.stringify(successAuth),
    { statusCode: 200, headers: { 'content-type': 'application/json' } } as any
  );
}

When('I switch to register mode', async () => {
  await mockAuthEndpoints();
  await LoginPage.registerMode();
});

When('I fill email {string} and password {string}', async (email: string, password: string) => {
  await mockAuthEndpoints();
  await LoginPage.email.setValue(email);
  await LoginPage.password.setValue(password);
});

When('I submit auth form', async () => {
  await LoginPage.submit.click();
  // mimic UI storing token after success
  await browser.execute(() => localStorage.setItem('token', 'fake-jwt'));
});

Then('I should be on {string}', async (path: string) => {
  // Use a direct URL check to avoid the toHaveUrlContaining typing issue
  await browser.waitUntil(
    async () => (await browser.getUrl()).includes(path),
    { timeout: 5000, timeoutMsg: `Expected URL to contain "${path}"` }
  );

  const current = await browser.getUrl();
  if (!current.includes(path)) {
    throw new Error(`Expected URL to contain "${path}", got "${current}"`);
  }
});

Then('I should see text {string}', async (text: string) => {
  await expect($(`//*[contains(., "${text}")]`)).toBeDisplayed();
});
