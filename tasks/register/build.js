module.exports = function (grunt) {
	grunt.registerTask('build', [
		'compileAssets',
		'concat',
		'clean:build',
		'copy:build'
	]);
};
