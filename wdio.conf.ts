export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./tests/e2e/features/**/*.feature'],
    maxInstances: 1,
    logLevel: 'info',
    framework: 'cucumber',
    reporters: ['spec'],
    services: ['devtools'],
    cucumberOpts: {
      require: ['./tests/e2e/steps/hooks.ts', './tests/e2e/steps/**/*.ts'],
      timeout: 60000,
      failAmbiguousDefinitions: true,
      requireModule: ['ts-node/register'],
    },
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 10000,
    capabilities: [
      {
        browserName: 'chrome',
        'goog:chromeOptions': { args: ['--disable-gpu', '--no-sandbox'] },
      },
    ],
  };
  
  export default config;
  