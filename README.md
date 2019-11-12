## circle-api-client

API wrapper in node for CircleCI API v1.

### Install
`npm install @hngrytrl/circle-api-client`

### Usage
```
const CircleClient = require('@hngrytrl/circle-api-client');

const client = new CircleClient(circleci-token, org, project);

// Trigger a job.
const buildOpts = { CIRCLE_JOB: 'job-name' };
client.runJob(buildOpts);

// Get data on a build.
// Pass in build number.
client.getBuild('22');

// Cancel a build.
client.cancelBuild('22);
```
