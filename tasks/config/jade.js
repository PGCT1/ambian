'use strict';

module.exports = function(grunt) {

	grunt.config.set('jade', {
		dev: {
			files: [{
				expand: true,
				cwd: 'views/',
				src: ['**/*.jade'],
				dest: '.tmp/templates/'
			}],
			options:{
	      runtime:false
	    }
		}
	});

	grunt.loadNpmTasks('grunt-jade');
};
