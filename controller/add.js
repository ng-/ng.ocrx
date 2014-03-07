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

			canvas.width  = 600 //Default w/rotation iPhone: 2448px
			canvas.height = 800 //Default w/rotation iPhone: 3264px
			// context.translate(canvas.width/2,canvas.height/2);

			var context = canvas.getContext('2d')

			context.translate(canvas.width, 0)

			context.rotate(Math.PI / 2)

			context.drawImage(img, 0, 0, 1200, 900)

			fg.saveFile(folder.uuid, 'item'+$scope.count+'.jpg', canvas.toDataURL('image/jpeg'))
		}

		img.src = URL.createObjectURL(files[0])
	}
}