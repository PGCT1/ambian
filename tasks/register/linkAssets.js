module.exports = function (grunt) {
	grunt.registerTask('linkAssets', [
		'sails-linker:devStyles',
		'sails-linker:devTpl',
		'sails-linker:devStylesJade',
		'sails-linker:devTplJade'
	]);
};
