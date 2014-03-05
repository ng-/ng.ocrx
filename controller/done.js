'use strict'

module.exports = function($scope,$location, $routeParams, data)
{
	//TODO remove write permission from folder!
	$scope.user   = data('user')
	$scope.folder = data('folder')
	$scope.count  = data('count')

	if ( ! $scope.user)
	{
		$location.path('/')
	}

	if ( ! $scope.folder)
	{
		$location.path('start')
	}

	var name = $scope.user.name.split(' ').shift()

	$scope.name  = ng.uppercase(name[0])+ng.lowercase(name.slice(1))

	$scope.signOut = function()
	{
		data('folder', undefined)
		data('count' , undefined)
		data('user'  , undefined)

		$location.path('/'+$scope.user.email)
	}
}