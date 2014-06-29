module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'sass:dev',
		'jade:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
