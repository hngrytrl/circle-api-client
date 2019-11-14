import * as popsicle from "popsicle";

let circleClient;

export default class BuildRequest {
  constructor(client) {
    circleClient = client;
  }

  /**
   * Makes request against CircleCI API and handles response.
   *
   * @param request
   * @returns {Promise<unknown>}
   */
  run(request) {
    return popsicle.request(this._buildRequest(request))
      .use(popsicle.plugins.parse('json'))
      .then(this._handleResponse)
      .catch((this._handleError));
  }

  /**
   * Builds requests to CircleCI API.
   *
   * @param { method, endpoint, headers, body } request
   *
   * @returns { RequestObject }
   */
  _buildRequest(request) {
    const baseUrl = `${circleClient._host}/${circleClient._version}/project/${circleClient._vcs}/${circleClient._username}/${circleClient._project}/${request.endpoint}?circle-token=${circleClient._token}`;

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

    return Promise.resolve(response);
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
