module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'sass:dev',
		'jade:dev',
		'sync:dev',
		'coffee:dev'
	]);
};
