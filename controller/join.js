'use strict'

module.exports = function($scope, $location, fg, data)
{
	$scope.user = {}

	$scope.groups = fg.listGroups()

	$scope.signUp = function(user)
	{
		//TODO User Validation
		
		fg.saveUser(user).then(function()
		{
			data('auth',
			{
				'fg-username':user.email,
				'fg-password':user.password,
				'fg-domain':'ocrx',
			})

			data('user',
			{
				name :user.name,
				email:user.email,
				group:user.group
			})

			$location.path('start')
		})
	}
}