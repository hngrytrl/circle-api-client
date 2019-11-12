import {triggerJob, cancelJob, getJobInfo} from './api/jobs';
import * as popsicle from 'popsicle';
import base from "popsicle/dist/base";

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
    let request = triggerJob(build_parameters, revision, tag);

    return popsicle.request(this._buildRequest(request))
      .use(popsicle.plugins.parse('json'))
      .then(this._handleResponse)
      .catch(this._handleError);
  }

  /**
   * Cancels a build.
   *
   * @param {String} build_num
   *
   * @returns {Promise}
   */
  cancelBuild(build_num) {
    let request = cancelJob(build_num);

    return popsicle.request(this._buildRequest(request))
      .use(popsicle.plugins.parse('json'))
      .then(this._handleResponse)
      .catch(this._handleError);
  }

  /**
   * Get info on a specific build.
   *
   * @param {String} build_num
   *
   * @returns {Promise}
   */
  getBuild(build_num) {
    let request = getJobInfo(build_num);

    return popsicle.request(this._buildRequest(request))
      .use(popsicle.plugins.parse('json'))
      .then(this._handleResponse)
      .catch((this._handleError));
  }

  /**
   * Builds requests to CircleCI API.
   *
   * @param {
   *          method
   *          endpoint
   *          headers
   *          body
   *        } request
   *
   * @returns { RequestObject }
   */
  _buildRequest(request) {
    const baseUrl = `${this._host}/${this._version}/project/${this._vcs}/${this._username}/${this._project}/${request.endpoint}?circle-token=${this._token}`;

    let requestObject = {
      url: baseUrl,
      method: request.method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Check if request supports a body.
    if (request.body && ['POST', 'PATCH', 'PUT'].indexOf(request.method.toUpperCase()) >= 0) {
      requestObject.body = request.body;
    }

    return requestObject;
  }

  /**
   * Checks response code.
   *
   * @returns { Promise }
   */
  _handleResponse(response) {
    if (response.status > 299) return Promise.reject(response);

    return Promise.resolve(response.body);
  }

  /**
   * Checks response code to determine error cause.
   *
   * @returns { Error }
   */
  _handleError(err) {
    let errorMsg;
    const response = JSON.stringify(err);

    // Return message based on response code.
    switch (err.status) {
      case 400:
        errorMsg = `Bad request. ${response}`;
        break;

      case 403:
        errorMsg = `Access denied. ${response}`;
        break;

      case 500:
        errorMsg = `Server error. ${response}`;
        break;

      default:
        errorMsg = `An error occured ${response}`;
    }

    return Promise.reject(Error(errorMsg));
  }
}
