/**
 * Base class for performing AJAX-Requests.
 * Requests can be performed by creating an C4GAjaxRequest and calling the send() method.
 */
class C4GAjaxRequest {

  /**
   * C4GAjaxRequest constructor.
   * @param url
   * @param method
   * @param settings
   */
  constructor(url, method = 'GET', settings = null) {
    this._url = url;
    if (!settings) {
      settings = {};
    }
    // use the request as this in the callbacks instead of the ajax parameters
    settings['context'] = this;
    // set other params
    settings['method'] = method;
    // set async to true, to avoid deprecated synchronous requests
    settings['async'] = true;
    this._settings = settings;
  }

  /**
   * Executes the request with the given settings and calls defined callbacks, if there are any.
   */
  execute() {
    jQuery.ajax(this._url, this._settings).done(function(data, textStatus, jqXHR) {
      if (this._settings['done'] && typeof this._settings['done'] === "function") {
        this._settings['done'](data, textStatus, jqXHR);
      }
    }).fail(function(data, textStatus, errorThrown) {
      if (this._settings['fail'] && typeof this._settings['fail'] === "function") {
        this._settings['fail'](data, textStatus, errorThrown);
      }
    }).always(function(data, textStatus, alt_jqXHR) {
      // the param alt_jqXHR is the jqXHR or the thrown error, depending on the status of the request
      if (this._settings['always'] && typeof this._settings['always'] === "function") {
        this._settings['always'](data, textStatus, alt_jqXHR);
      }
    });
  }

  /**
   * Adds a 'always' callback to the request.
   * The callback is always executed after the request is finished, no matter what the status is.
   * The callback function gets passed three parameters: the response data, the statusText and if the request was
   * successful, the request object, otherwise the thrown error.
   * @param callback
   */
  addAlwaysCallback(callback) {
    if (callback && typeof callback === "function") {
      this._settings['always'] = callback;
    }
  }

  /**
   * Adds a 'fail' callback to the request.
   * The callback is executed after the request is finished with an error.
   * The callback function gets passed three parameters: the response data, the statusText and the error.
   * @param callback
   */
  addFailCallback(callback) {
    if (callback && typeof callback === "function") {
      this._settings['fail'] = callback;
    }
  }

  /**
   * Adds a 'done' callback to the request.
   * The callback is executed after the request is finished successful.
   * The callback function gets passed three parameters: the response data, the statusText and the request object.
   * @param callback
   */
  addDoneCallback(callback) {
    if (callback && typeof callback === "function") {
      this._settings['done'] = callback;
    }
  }

  /**
   * Adds request data to the request.
   * @param data
   */
  addRequestData(data) {
    this._settings['data'] = data;
  }

  /**
   * Helper function for accessing request parameter data.
   * @param key
   * @returns {*}
   */
  getRequestParameterField(key) {
    return this._settings[key];
  }

  get url() {
    return this._url;
  }

  set url(value) {
    this._url = value;
  }

  get settings() {
    return this._settings;
  }

  set settings(value) {
    this._settings = value;
  }
}

jQuery(document).ready(function () {
  let req = new C4GAjaxRequest("/con4gis/layerService/1");
  req.addDoneCallback(function (data) {
    console.log(data);
  });
  req.execute();
});