'use strict'

module.exports = function($scope, $window, $document, $location, fg, data)
{
	var user    = data('user')
	  , folder  = data('folder')
	  , canvas  = document.createElement('canvas')
	  , context = canvas.getContext('2d')
	  //Default iPhone: 3264px x 2448px w/ vertical squash of .5 as calculated by
	  //http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
	  , squish  = 'iPhone' == navigator.platform ? 2 : 1
	  , scale   = .75
	  , img     = new Image

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

		img.onload = function()
		{
			URL.revokeObjectURL(img.src)

			canvas.width  = img.width  * scale
			canvas.height = img.height * scale

			context.drawImage
			(
				img,
				0/squish,
				0/squish,
				img.width/squish,
				img.height/squish,
				0,
				0,
				canvas.width,
				canvas.height
			)

			//Pad the digits to help with alphabetical ordering in foldergrid
			var pad = $scope.count < 10 ? '00' : $scope.count < 100 ? '0' : ''

			fg.saveFile(folder.uuid, 'image'+pad+$scope.count+'.jpg', canvas.toDataURL('image/jpeg', .85))
		}

		img.src = URL.createObjectURL(files[0])
	}
}