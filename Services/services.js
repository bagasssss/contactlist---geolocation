(function(){
	'use strict';

	angular.module("list.services",[])

		.factory("dataLoader", function($http){
			var listPath = 'https://jsonplaceholder.typicode.com/users';
			return {
				getData: function() {
					return $http({
						method: "GET",
						url: listPath
					}).success(function(response) {
						return response.data;

					})
				}
			}

		})





})();