'use strict'

module.exports = function($scope, $window, $location, fg, data)
{
	'use strict'

	var user   = data('user')
	  , folder = data('folder')

	if ( ! user)
	{
		$location.path('/')
	}

	if ( ! folder)
	{
		$location.path('start')
	}

	$scope.count = data('count')

	$scope.done = function()
	{
		$location.path('done')
	}

	$scope.nextItem = function(files)
	{
		var reader = new $window.FileReader

		reader.onload = function()
		{
			fg.saveFile(folder.uuid, files[0].name, this.result)
		}

		reader.readAsDataURL(files[0]);

		$scope.count = data('count+', 1)
	}
}