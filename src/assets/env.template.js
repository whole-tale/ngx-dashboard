(function(window) {
  window.env = window.env || {};

  // Environment variables
  window.env.apiUrl = '${GIRDER_API_URL}';
  window.env.dataONEBaseUrl = '${DATAONE_URL}';
  window.env.authProvider = '${AUTH_PROVIDER}';
  window.env.rtdBaseUrl = '${RTD_URL}';
})(this);
