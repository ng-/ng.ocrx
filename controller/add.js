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

	$scope.right = $scope.count < 10 ? '-100px' : '-150px'

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

			canvas.width  = 600
			canvas.height = 800
			// context.translate(canvas.width/2,canvas.height/2);

			var context = canvas.getContext('2d')

			context.translate(canvas.width, 0)

			context.rotate(Math.PI / 2)

			//Default iPhone: 3264px x 2448px w/ vertical squash of .5 as calculated by
			//http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
			context.drawImage(img, 0/2, 0/2, 3264/2, 2448/2, 0, 0, canvas.height, canvas.width)

			fg.saveFile(folder.uuid, 'item'+$scope.count+'.jpg', canvas.toDataURL('image/jpeg'))
		}

		img.src = URL.createObjectURL(files[0])
	}
}