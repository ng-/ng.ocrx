'use strict'

module.exports = function($scope, $routeParams, $location, fg, data, alert)
{
	$scope.user = {email: $routeParams.email}


	$scope.login = function(user)
	{
		fg.login(user)

		.then(function(user)
		{
			data('user', user)

			$location.path('start')
		})

		.catch(function(res)
		{
			alert.danger(res.data)
		})
	}
}