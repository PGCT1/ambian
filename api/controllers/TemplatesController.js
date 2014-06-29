'use strict';

module.exports = {

	render:function(req,res){

		res.render(req.path.substring('/templates/'.length) + '.jade');

	},


	// get rid of annoying 404 error during development because cordova.js isn't present
	cordovajs:function(req,res){

		res.set('Content-Type','application/javascript');

		res.send('');
	}

};

