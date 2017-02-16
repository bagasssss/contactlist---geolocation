(function(){
	'use strict';

	angular.module("list.directives", ["list.services", "ui.bootstrap", "toastr"])

		.directive("listDirective", function(dataLoader, $uibModal, toastr ){
			return {
				restrict: "E",
				templateUrl: "Views/listTemplate.html",
				controllerAs: "ctrl",
				controller: function($scope) {
					var vm = this;

					vm.list;
					vm.filterType = 'name';
					vm.id = 11;
					vm.editContact;
					vm.emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
					vm.websitePattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

					vm.mylat;
					vm.mylong;

					activate();
					function activate() {
						getDataFromFile();
						geoFindMe();
					};

					function getDataFromFile(){
						dataLoader.getData().success(function(data){
							vm.list = data;
							console.log("data in ctrl");
							console.log(vm.list);


						})
					};

					/*$scope.$watch("$viewContentLoaded", function(){
								toaster.success("Data uploaded!", "Success!")

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
									  "timeOut": "5000",
									  "extendedTimeOut": "1000",
									  "showEasing": "swing",
									  "hideEasing": "linear",
									  "showMethod": "fadeIn",
									  "hideMethod": "fadeOut"
									}
						});*/

					

					vm.changeFilterType = function(filterTypeFromClick) {
						console.log("change filter to "+filterTypeFromClick);
						if (vm.filterType === filterTypeFromClick) {
							vm.filterType = "-"+vm.filterType;
						} else {
							vm.filterType = filterTypeFromClick;
						}
					};

					vm.newContactModal;
					vm.openModal = function() {
						vm.newContactModal = $uibModal.open({
							templateUrl: 'Views/modalWindowForNewContact.html',
							animation: true,
							ariaLabelledBy: 'modal-title',
							ariaDescribedBy: 'modal-body',
							

						})
					};

					vm.addContact = function(newContact) {
						var contact = {
							id: vm.id,
							name: newContact.name,
							username: newContact.username,
							email: newContact.email,
							address: {street: newContact.address},
							phone: newContact.phone,
							website: newContact.website,
							company: {name: newContact.company.name}
						};
						vm.id++;
						vm.list.push(contact);
						console.log("new contact added")
						vm.newContactModal.close();

					};

					vm.editModal;

					vm.openEditModal = function(oldContact) {
						vm.editModal = $uibModal.open({
							templateUrl: 'Views/editModal.html',
							animation: true,
							ariaLabelledBy: 'modal-title',
							ariaDescribedBy: 'modal-body',
							/*constroller: "modalController as vm"*/

						});

						vm.editContact = oldContact;
						console.log(vm.editContact);
					};

					vm.applyEditing = function(newData) {
						for(var i=0; i<vm.list.length; i++) {
							if(vm.list[i].id === vm.editContact.id) {
								vm.list[i].name = newData.name;
								vm.list[i].username = newData.username;
								vm.list[i].email = newData.email;
								vm.list[i].address.street = newData.address.street;
								vm.list[i].phone = newData.phone;
								vm.list[i].website = newData.website;
								vm.list[i].company.name = newData.company.name;
								console.log("edited");
								vm.editModal.close()
								break;
							};

						}
					};

					vm.deleteContact = function() {
						for(var i=0; i<vm.list.length; i++) {
							if(vm.list[i].id === vm.editContact.id) {
								vm.list.splice(i,1);
								console.log("contact delete");
								
								break;
							};

						}
						vm.editModal.close()


					};



					function geoFindMe() {
						function success(position) {
							vm.mylat  = position.coords.latitude;
    						vm.mylong = position.coords.longitude;
    						console.log("geolocation - SUCCESS")
    						console.log(vm.mylat);
    						console.log(vm.mylong);
    						calculateContactDistance();
						};
						function error() {
							alert("Unable to retrieve your location");
						}
						navigator.geolocation.getCurrentPosition(success, error);
					};

					function distance(lat1, lon1, lat2, lon2) {
					  var p = 0.017453292519943295;    // Math.PI / 180
					  var c = Math.cos;
					  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
					          c(lat1 * p) * c(lat2 * p) * 
					          (1 - c((lon2 - lon1) * p))/2;
					  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
					};

					function calculateContactDistance() {
						for(var i=0; i<vm.list.length; i++) {
							var userAddress = vm.list[i].address;
							vm.list[i].distance = Math.round(distance(userAddress.geo.lat, userAddress.geo.lng, vm.mylat, vm.mylong )*100) /100;
						};
						$scope.$apply();
					};

					vm.isFieldNotUnique = function(fieldName, value) {
						var isNotUnique = false;
						for(var i=0; i<vm.list.length; i++) {
							if(!vm.list[i].hasOwnProperty(fieldName)) continue;
							if(vm.list[i][fieldName] === value) {
								isNotUnique = true;
								break;
							}
						}
						return isNotUnique;
					};





					
					





				}
			}
		})
		






})();


