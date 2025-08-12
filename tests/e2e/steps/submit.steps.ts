
import { Given, When, Then } from '@wdio/cucumber-framework';
import { browser, $, expect } from '@wdio/globals';
import SubmitPage from '../pages/submit.page';

async function mockGraphQLForSubmit() {
  
  const types = {
    data: {
      getPlasticTypes: [
        {
          id: 'pla',
          name: 'PLA',
          colors: [
            { inStock: true, color: { id: 'blue', name: 'Blue', hex: '#0000FF' } },
            { inStock: false, color: { id: 'red', name: 'Red', hex: '#FF0000' } },
          ],
        },
      ],
    },
  };

  const submitOk = { data: { submitPrintRequest: { id: 'req-1' } } };

  const gql = await browser.mock('**/graphql', { method: 'post' });

  
  (gql as any).respond(
    (req: any) => {
      const raw = typeof req.body === 'string' ? req.body : String(req.body ?? '{}');
      const body = JSON.parse(raw);
      const q: string = body?.query ?? '';

      if (q.includes('getPlasticTypes')) return JSON.stringify(types);
      if (q.includes('submitPrintRequest')) return JSON.stringify(submitOk);
      return JSON.stringify({ data: {} });
    },
    {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      fetchResponse: false,
    } as any
  );
}

Given('I am authenticated', async () => {
  
  await browser.url('/login');

  
  await browser.execute(() => {
    localStorage.setItem('token', 'fake-jwt');
    window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: 'fake-jwt' }));
  });

  
});

When('I enter file url {string}', async (url: string) => {
  await mockGraphQLForSubmit(); 
  await SubmitPage.fileUrl.setValue(url);
});

When('I choose plastic {string}', async (plasticName: string) => {
  await SubmitPage.plastic.selectByVisibleText(plasticName);
});

When('I choose color {string}', async (colorName: string) => {
  await SubmitPage.color.selectByVisibleText(colorName);
});

When('I submit the request form', async () => {
  await SubmitPage.submit.click();
});

Then('I should see at least 1 row in history', async () => {
  await expect($('[data-testid="history-table"] tbody tr')).toBeExisting();
});
