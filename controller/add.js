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

			canvas.width  = img.width  * 1
			canvas.height = img.height * 1

			var context = canvas.getContext('2d')

			//Default iPhone: 3264px x 2448px w/ vertical squash of .5 as calculated by
			//http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
			context.drawImage(img, 0/2, 0/2, img.width/2, img.height/2, 0, 0, canvas.width, canvas.height)

			//Pad the digits to help with alphabetical ordering in foldergrid
			var pad = $scope.count < 10 ? '00' : $scope.count < 100 ? '0' : ''

			fg.saveFile(folder.uuid, 'image'+pad+$scope.count+'.jpg', canvas.toDataURL('image/jpeg', .5))
		}

		img.src = URL.createObjectURL(files[0])
	}
}