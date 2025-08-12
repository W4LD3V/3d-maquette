import { Before } from '@wdio/cucumber-framework';
import { browser } from '@wdio/globals';

async function mockUser() {
  const userMock = await browser.mock('**/api/user', { method: 'get' });
  (userMock as any).respond(() => JSON.stringify({ id: 'u1', email: 'test@maquette.dev' }), {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
  } as any);
}

async function mockAuth() {
  const login = await browser.mock('**/api/login', { method: 'post' });
  const register = await browser.mock('**/api/register', { method: 'post' });
  const success = { token: 'fake-jwt', user: { id: 'u1', email: 'test@maquette.dev' } };

  (login as any).respond(() => JSON.stringify(success), {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
  } as any);
  (register as any).respond(() => JSON.stringify(success), {
    statusCode: 201,
    headers: { 'content-type': 'application/json' },
  } as any);
}

Before(async () => {
  
  await mockUser();
  await mockAuth();
});
