(function(){
	'use strict';

	angular.module("list.directives", ["list.services", "ui.bootstrap"])

		.directive("listDirective", function(listService, $uibModal ){
			return {
				restrict: "E",
				templateUrl: "Views/listTemplate.html",
				controllerAs: "ctrl",
				controller: function() {
					var vm = this;

					vm.list;
					vm.filterType = 'name';
					vm.id = 11;
					vm.editContact;

					vm.mylat;
					vm.mylong;

					activate();

					function activate() {
						getDataFromFile();
						geoFindMe();


					};

					function getDataFromFile(){
						listService.getData().success(function(data){
							vm.list = data;
							console.log("data in ctrl");
							console.log(vm.list);

						})
					};

					vm.changeFilterType = function(filterTypeFromClick) {
											console.log("change filter to "+filterTypeFromClick);
											if (vm.filterType === filterTypeFromClick) {
												vm.filterType = "-"+vm.filterType;
											} else {
												vm.filterType = filterTypeFromClick;
											}
						};

					vm.openModal = function() {
						$uibModal.open({
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
							address: newContact.address,
							phone: newContact.phone,
							website: newContact.website
						};
						vm.id++;
						vm.list.push(contact);
						console.log("new contact added")
						
					};

					vm.openEditModal = function(oldContact) {
						$uibModal.open({
							templateUrl: 'Views/editModal.html',
							animation: true,
							ariaLabelledBy: 'modal-title',
							ariaDescribedBy: 'modal-body',

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
								console.log("edited");
								
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

					};



					function geoFindMe() {
						function success(position) {
							vm.mylat  = position.coords.latitude;
    						vm.mylong = position.coords.longitude;
    						console.log("geolocation - SUCCESS")
    						console.log(vm.mylat);
    						console.log(vm.mylong);
    						//console.log(distance(81.1496, -37.3159, vm.mylat, vm.mylong));
    						calculateContactDistance();
						};
						function error() {
							alert("Unable to retrieve your location");
						}

						navigator.geolocation.getCurrentPosition(success, error)
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
						var newlist = vm.list;
						for(var i=1; i<newlist.length; i++) {
							
							newlist[i].distance = Math.round(distance(newlist[i].address.geo.lat, newlist[i].address.geo.lng, vm.mylat, vm.mylong )*100) /100;
							console.log(newlist);

						};
						vm.list = newlist;
					};

					
					





				}
			}
		})






})();