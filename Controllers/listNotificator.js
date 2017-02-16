(function(){

angular.module("listNotificator", ["toastr"])
	.controller("notification", function(toastr, $scope){

			$scope.$watch("$viewContentLoaded", function(){
								
								toastr["success"]("Data - uploaded!")
								toastr.options = {
									  "closeButton": false,
									  "debug": false,
									  "newestOnTop": false,
									  "progressBar": false,
									  "positionClass": "toast-top-right",
									  "preventDuplicates": false,
									  "onclick": null,
									  "showDuration": "300",
									  "hideDuration": "1000",
									  "timeOut": "1000",
									  "extendedTimeOut": "500",
									  "showEasing": "swing",
									  "hideEasing": "linear",
									  "showMethod": "fadeIn",
									  "hideMethod": "fadeOut"
									}
						});
		})


})();