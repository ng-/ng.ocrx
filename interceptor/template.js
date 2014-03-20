'use strict'

exports.server = function()
{
	return {

		response:function(response)
		{
			response.data = response.data ||
			[
				"<html ng-app='ng.ocrx'>",
					'<head>',
						'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">',
						'<meta name="apple-mobile-web-app-capable" content="yes">',
						"<link href='//netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css' rel='stylesheet'>",
						"<style>",
							".text-title { font-size:30px; font-weight:100; }",
						"</style>",
						ng,
					"</head>",
					"<body>",
						"<div class='pull-right' style='margin-right:15px'><span class='text-title'>OC<span class='text-danger'>R</span></span><span class='text-danger'>X</span></div>",
						"<div class='ng-view'></div>",
					"</body>",
				"</html>"
			]
			.join('\n')

			return response
		}
	}
}