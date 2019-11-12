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

// Trigger a job for a specific git commit.
const buildOpts = { CIRCLE_JOB: 'job-name' };
const sha = 'fdhsa376s'
client.runJob(buildOpts, sha);

// Trigger a job for a specific tag.
const buildOpts = { CIRCLE_JOB: 'job-name' };
const tag = 'v1.1'
client.runJob(buildOpts, null, tag);

// Get data on a build.
// Pass in build number.
client.getBuild('22');

// Cancel a build.
client.cancelBuild('22');
```
