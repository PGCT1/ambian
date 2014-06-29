
var templateFilesToInject = [
  'templates/**/*.js'
];

module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return '.tmp/' + path;
});
