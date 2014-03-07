'use strict'

module.exports = function($scope, $window, $document, $location, fg, data)
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
		$scope.count = data('count+', 1)

		var img = new Image

		img.onload = function()
		{
			URL.revokeObjectURL(img.src)

			var canvas = document.createElement('canvas')

			canvas.width  = 800 //Default iPhone: 3264px
			canvas.height = 600 //Default iPhone: 2448px

			canvas.getContext('2d').drawImage(img, 0, 0, width, height)

			fg.saveFile(folder.uuid, 'item'+$scope.count+'.jpg', canvas.toDataURL('image/jpeg'))
		}

		img.src = URL.createObjectURL(files[0])
	}
}