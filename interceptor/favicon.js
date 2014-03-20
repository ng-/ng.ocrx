'use strict'

exports.server = function($q)
{
	var readFile = require('fs').readFile

	return {

		request:function(config)
		{
			if ('/apple-touch-icon.png' != config.url && '/favicon.ico' != config.url)
			{
				return config
			}

			var q = $q.defer()

			readFile('image'+config.url, function(err, file)
			{
				q.reject({status: err ? 404 : 200, data:file})
			})

			return q.promise
		}
	}
}