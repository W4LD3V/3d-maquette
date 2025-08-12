import { Given, When, Then } from '@wdio/cucumber-framework';
import { browser, expect } from '@wdio/globals';
import HistoryPage from '../pages/history.page';

type Req = {
  id: string;
  fileUrl: string;
  plasticType: { name: string };
  color: { name: string; hex: string };
  createdAt: string;
};

let current: Req[] = [];

async function mockGraphQLForHistory(initial: Req[]) {
  current = [...initial];

  const gql = await browser.mock('**/graphql', { method: 'post' });

  (gql as any).respond(
    (req: any) => {
      const raw = typeof req.body === 'string' ? req.body : String(req.body ?? '{}');
      const body = JSON.parse(raw);
      const q: string = body?.query ?? '';

      if (q.includes('getPrintRequests')) {
        return JSON.stringify({ data: { getPrintRequests: current } });
      }

      if (q.includes('deletePrintRequest')) {
        const id = body?.variables?.id as string;
        current = current.filter((r) => r.id !== id);
        return JSON.stringify({ data: { deletePrintRequest: true } });
      }

      return JSON.stringify({ data: {} });
    },
    {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      fetchResponse: false,
    } as any
  );
}

Given('the history has 2 requests', async () => {
  const two: Req[] = [
    {
      id: 'r1',
      fileUrl: 'https://f/1.stl',
      plasticType: { name: 'PLA' },
      color: { name: 'Blue', hex: '#00F' },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'r2',
      fileUrl: 'https://f/2.stl',
      plasticType: { name: 'ABS' },
      color: { name: 'Black', hex: '#000' },
      createdAt: new Date().toISOString(),
    },
  ];
  await mockGraphQLForHistory(two);
});

When('I delete the first request', async () => {
  await HistoryPage.deleteButtonById('r1').click();
  await browser.pause(200);
});

Then('the table should have {int} row', async (n: number) => {
  const rows = await HistoryPage.rows;
  await expect(rows).toBeElementsArrayOfSize(n);
});
