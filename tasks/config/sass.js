'use strict';

module.exports = function(grunt) {

	grunt.config.set('sass', {
		dev: {
			files: [{
				expand: true,
				cwd: 'assets/styles/',
				src: ['**/*.sass'],
				dest: '.tmp/public/styles/',
				ext: '.css'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-sass');
};
