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

			context.drawImage(img, 0, 0, 3264, 2448, 0, 0, 800, 1200)

			//drawImageIOSFix(context, img, 0, 0, 3264, 2448, 0, 0, 800, 600)

			fg.saveFile(folder.uuid, 'item'+$scope.count+'.jpg', canvas.toDataURL('image/jpeg'))
		}

		/**
		 * Detecting vertical squash in loaded image.
		 * Fixes a bug which squash image vertically while drawing into canvas for some images.
		 * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
		 *
		 */
		function detectVerticalSquash(img) {
			 var iw = img.naturalWidth, ih = img.naturalHeight;
			 var canvas = document.createElement('canvas');
			 canvas.width = 1;
			 canvas.height = ih;
			 var ctx = canvas.getContext('2d');
			 ctx.drawImage(img, 0, 0);
			 var data = ctx.getImageData(0, 0, 1, ih).data;
			 // search image edge pixel position in case it is squashed vertically.
			 var sy = 0;
			 var ey = ih;
			 var py = ih;
			 while (py > sy) {
				  var alpha = data[(py - 1) * 4 + 3];
				  if (alpha === 0) {
						ey = py;
				  } else {
						sy = py;
				  }
				  py = (ey + sy) >> 1;
			 }
			 var ratio = (py / ih);
			 return (ratio===0)?1:ratio;
		}

		/**
		 * A replacement for context.drawImage
		 * (args are for source and destination).
		 */
		function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
			 var vertSquashRatio = detectVerticalSquash(img);

			 $scope.vertical = '    '+vertSquashRatio+'   '+img.width+'  '+img.height
		 // Works only if whole image is displayed:
		 // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
		 // The following works correct also when only a part of the image is displayed:
			 ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
									  sw * vertSquashRatio, sh * vertSquashRatio,
									  dx, dy, dw, dh );
		}

		img.src = URL.createObjectURL(files[0])
	}
}