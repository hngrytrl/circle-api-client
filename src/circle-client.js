import Jobs from './api/jobs';

export default class CircleClient {
  /**
   *
   * @param { String } token
   * @param { String } username
   * @param { String } project
   * @param { host, version, vcs }
   */
  constructor(token, username, project, options = {}) {
    this._token = token;
    this._username = username;
    this._project = project;
    this._host = options.host || 'https://circleci.com/api';
    this._version = options.version || 'v1.1';
    this._vcs = options.vcs || 'github';
  }

  /**
   * Triggers a new job.
   *
   * @param { String } revision
   * @param { String } tag
   * @param { CIRCLE_JOB } build_parameters
   *
   * @returns { Promise }
   */
  runJob(build_parameters = {}, revision = null, tag = null) {
    return new Jobs(this).triggerJob(build_parameters, revision, tag);
  }

  /**
   * Cancels a build.
   *
   * @param { String } build_num
   *
   * @returns { Promise }
   */
  cancelBuild(build_num) {
    return new Jobs(this).cancelJob(build_num);
  }

  /**
   * Get info on a specific build.
   *
   * @param { String } build_num
   *
   * @returns { Promise }
   */
  getBuild(build_num) {
    return new Jobs(this).getJob(build_num);
  }
}
