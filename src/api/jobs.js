/**
 * Helps populate request object for triggering a new job.
 *
 * @param { String } revision - revision to build.
 * @param { String } tag - tag to build.
 * @param {} build_opts - build parameters, e.g. environment variable and job name.
 * @returns {} data to build the request.
 *
 * @see https://circleci.com/docs/api/#trigger-a-new-job
 */
function triggerJob(build_opts, revision = null, tag = null) {
  let body = {};

  // CircleCI API does not allow both a revision and tag to be specified when triggering a build.
  if (revision != null && tag != null) {
    return Error('Cannot trigger build with both revision and tag specified.');
  }

  // Add revision to build if specified.
  if (revision) body.revision = revision;

  // Add tag to build if specified.
  if (tag) body.tag = tag;

  // Add build_parameters if specified.
  if (build_opts) body.build_parameters = build_opts;

  return {
    'method': 'POST',
    'endpoint': '',
    'body': body
  };
}

/**
 * Helps populate request object to cancel a job.
 *
 * @param { String } build_num - build to cancel.
 *
 * @returns {} Data for request.
 */
function cancelJob(build_num) {
  if (!build_num) return Error('To cancel a build, you must provide a build number.');

  return {
    'method': 'POST',
    'endpoint': `${build_num}/cancel`,
    'body': null
  }
}

/**
 * Helps populate request object to get data on a specific build.
 *
 * @param { String } build_num - build number for data requested.
 */
function getJobInfo(build_num) {
  if (!build_num) return Error('To request data on a build, you must provide a build number');

  return {
    'method': 'GET',
    'endpoint': `${build_num}`
  }
}

export {triggerJob, cancelJob, getJobInfo};
