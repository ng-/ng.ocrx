exports.client = function($locationProvider, $routeProvider)
{
	$locationProvider.html5Mode(true)

	$routeProvider.otherwise
	({
		redirectTo: '/login'
   })
}