'use strict'

exports.server = function($q)
{
	return {

		request:function(config)
		{
			//var protocol = res ? req.connection.encrypted ? 'https' : 'http' : req.encrypted ? 'tls' : 'net'

			if (config.connection.encrypted)
			{
				return config
			}

			return $q.reject({status:302, headers:{location:'https://'+config.headers.host+config.url}})
		}
	}
}