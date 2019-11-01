import { 
  triggerJob
  cancelJob  } from './api/jobs';
import popsicle from 'popsicle';

class CircleClient {
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
  runJob(revision = null, tag = null, build_parameters = {}) {
    let request = triggerJob(revision, tag, build_parameters);

    return popsicle.request(this._buildRequest(request))
      .use(popsicle.plugins.parse('json'))
      .then(this._handleResponse)
      .catch(this._handleError);
  }

  /**
   * 
   */
  cancelBuild() {}

  /**
   * 
   */
  getBuildInfo() {}

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
    let baseUrl;

    // Determine which endpoint to hit.
    switch (request.endpoint) {
      case 'project':
        baseUrl = `${this._host}/${this._version}/project/${this._vcs}/${this._username}/${this._project}`;
        break;
    }
    
    let requestObject = {
      url: baseUrl,
      method: request.method.toUpperCase(),
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + this._token,
        'Content-type': 'application/json'
      }
    };

    // Check if request supports a body.
    if (request.body && ['POST', 'PATCH', 'PUT'].indexOf(request.method.toUpperCase()) >= 0) {
      requestObject.body = body;
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

    return Promise.resolve(response);
  }

  /**
   * Checks response code to determine error cause.
   * 
   * @returns { Error }
   */
  _handleError(err) {
    let errorMsg;

    // Return message based on response code.
    switch (err.status) {
      case 400:
        errorMsg = 'Bad request.';
        break;

      case 403:
        errorMsg = 'Access denied.';
        break;
      
      case 500:
        errorMsg = 'Server error.';
        break;
      
      default:
        errorMsg = `An error occured: ${err}`;
    }

    return Promise.reject(Error(errorMsg));
  }
}

export default CircleClient;
