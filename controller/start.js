'use strict'

module.exports = function($scope, $http, $window, $location, $q, fg, data)
{
	var user  = data('user')

	if ( ! user)
	{
		$location.path('/')
	}

	$scope.locations =
	[
		"Front Office",
		"Director of Nursing's Office",
		"Medication Room",
		"Nursing Station",
		"No Pickup Required"
	]

	$scope.select = function(location)
	{
		$scope.room = location
	}

	$scope.start = function()
	{
		var folder =
		{
			date : (new Date).toJSON().slice(0, 16),
			send : $scope.label ? '. Send me more labels' : '',
			track: $scope.tracking,
			room : $scope.room
		}

		folder.uuid = folder.date+'-'+user.email,
		folder.name = folder.date+' '+user.group+' #'+folder.track+' @'+folder.room+folder.send

		fg.saveFolder(folder.uuid, folder.name)

		.then(function()
		{
			//For a 2nd donation, this erases old folder: back button will no longer work
			data('folder', folder)
			data('count',  0)

			$location.path('add')
		})
	}
}